import OPQueue from "../../../models/doctor/opQueue/opQueue.model.js";
import Drug from "../../../models/inventory/drug/drug.model.js";
import StockEntry from "../../../models/inventory/stockEntry/stockEntry.model.js";
import OpPrescription from "../../../models/pharmacy/op_prescription/opPrescription.model.js";
import Patient from "../../../models/reception/new_patient_reg/newPatient.model.js";
import OpPrescriptionBill from "../../../models/billing/opPrescriptionBill/opPrescriptionBill.model.js";
import Clinic from "../../../models/superAdmin/clinic.model.js";
import InvoiceNumber from "../../../models/superAdmin/invoiceNumber.model.js";
import ConsultationPrint from "../../../models/clinicAdmin/masterDataConfig/printSettings/consultationPrint/consultationPrint.model.js";


//Utility function
function calculateQtyToDispense(frequency, duration) {
    const freqParts = frequency.split("-").map(Number); // e.g. "1-0-1" → [1,0,1]
    const totalPerDay = freqParts.reduce((sum, val) => sum + val, 0);
  
    const daysMatch = duration.match(/(\d+)/);
    const days = daysMatch ? parseInt(daysMatch[1], 10) : 0;
  
    return totalPerDay * days;
  }
  
  export const previewPrescription = async (req, res) => {
    try {
      const { mrn } = req.params;
      const clinicId = req.user.id;
  
      const opqueue = await OPQueue.findOne({ mrn, clinicId });
      if (!opqueue || !opqueue.prescription || opqueue.prescription.length === 0) {
        return res.status(404).json({ message: "No prescription found for the patient." });
      }
  
      const previewData = await Promise.all(
        opqueue.prescription.map(async (item) => {
          let qtyToDispense;

          const isSyrup = item.dosage && item.dosage.toLowerCase().includes("ml");
          if (isSyrup) {
            qtyToDispense = 1; // For syrups, dispense 1 bottle
          } else {
            qtyToDispense = calculateQtyToDispense(item.frequency, item.duration);
          }
  
          const stockEntries = await StockEntry.find(
            {
              clinicId: clinicId,
              "itemDetails.drug": { $regex: item.drug, $options: "i" },
            },
            { itemDetails: 1 }
          );
  
          let qtyInStock = 0;
          stockEntries.forEach((entry) => {
            entry.itemDetails.forEach((stockItem) => {
              if (stockItem.drug.toLowerCase() === item.drug.toLowerCase()) {
                qtyInStock += stockItem.quantity + stockItem.freeQuantity;
              }
            });
          });
  
          return {
            ...item.toObject ? item.toObject() : item,
            qtyToDispense,
            qtyInStock,
            action: qtyInStock >= qtyToDispense ? "Dispense" : "Replace",
          };
        })
      );
  
      res.status(200).json({ prescriptionPreview: previewData });
  
    } catch (error) {
      console.error("Error in previewPrescription:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

export const getStockOptions = async (req, res) => {
    try {
      const { drug } = req.query;
      if (!drug) {
        return res.status(400).json({ message: "Drug name is required" });
      }
  
      // Find matching stocks for this drug
      const stockEntries = await StockEntry.find(
        {
          clinicId: req.user.id,
          "itemDetails.drug": { $regex: drug, $options: "i" },
        },
        { itemDetails: 1 }
      );
  
      const options = [];
      const drugData = await Drug.findOne({ name: drug, clinicId: req.user.id });
      stockEntries.forEach(entry => {
        entry.itemDetails.forEach(item => {
          if (item.drug.toLowerCase() === drug.toLowerCase()) {
            options.push({
              batchNumber: item.batchNumber,
              expiryDate: item.expiryDate,
              mrp: item.mrp,
              gst: drugData.gst || 0,
              quantity: item.quantity + item.freeQuantity,
            });
          }
        });
      });
  
      if (options.length === 0) {
        return res.status(404).json({ message: "No stock options found for this drug" });
      }
  
      res.status(200).json({ options });
  
    } catch (error) {
      console.error("Error fetching stock options:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  /**
 * Final Billing API
 * ---------------------
 * STEP 1: When user selects a drug to dispense, call `/api/pharmacy/stock-options?drug=DrugName`
 *         → This gives batchNumber, expiryDate, MRP, GST for dropdowns
 *
 * STEP 2: User selects batch and expiry, enters discount
 *         → Frontend calculates: discountAmount, gstAmount, total
 *
 * STEP 3: Build final payload:
 *   {
 *     mrn: "123456",
 *     billItems: [
 *       {
 *         drug: "Aspirin",
 *         qtyToDispense: 10,
 *         batchNumber: "B123",
 *         expiryDate: "2026-12-01",
 *         mrp: 50,
 *         gst: 5,
 *         disc: 10,
 *         total: 475
 *       }
 *     ]
 *   }
 *
 * STEP 4: POST to `/api/pharmacy/final-bill`
 *         → This API updates stock, stores dispensed drugs in OpPrescription
 */

  
  export const generateFinalBill = async (req, res) => {
    try {
      const { mrn, billItems } = req.body;
  
      if (!mrn || !Array.isArray(billItems) || billItems.length === 0) {
        return res.status(400).json({ message: "Invalid input data" });
      }
  
      const prescriptionArray = [];

      let subtotal = 0;
      let totalGst = 0;

      for (const item of billItems) {
        const {
          drug,
          qtyToDispense,
          batchNumber,
          expiryDate,
          mrp,
          gst,
          disc,
          total
        } = item;
        prescriptionArray.push({
          drug,
          qty: qtyToDispense,
          batch: batchNumber,
          expiry: new Date(expiryDate),
          mrp,
          gst,
          disc,
          amount: total
        });
        
        //Calculating the subtotal amount and subtotal gst
        subtotal += total;
        totalGst += gst;

        let quantityToDeduct = qtyToDispense;
  
        const stockEntry = await StockEntry.findOne({
          clinicId: req.user.id,
          "itemDetails.drug": drug,
          "itemDetails.batchNumber": batchNumber,
          "itemDetails.expiryDate": new Date(expiryDate)
        });
  
        if (!stockEntry) {
          return res.status(404).json({ message: `Stock not found for drug ${drug}` });
        }

        let updated = false;
        stockEntry.itemDetails = stockEntry.itemDetails.map(detail => {
          if (
            detail.drug === drug &&
            detail.batchNumber === batchNumber &&
            new Date(detail.expiryDate).toISOString() === new Date(expiryDate).toISOString()
          ) {
            if (detail.quantity < quantityToDeduct) {
              throw new Error(`Insufficient stock for ${drug}`);
            }
            detail.quantity -= quantityToDeduct;
            updated = true;
          }
          return detail;
        });
  
        if (!updated) {
          return res.status(500).json({ message: `Failed to update stock for ${drug}` });
        }
  
        await stockEntry.save();
  
        // //Prepare the entry for OpPrescription
        // prescriptionArray.push({
        //   drug,
        //   dosage: "-", // Optional: can be passed in future
        //   frequency: "-",
        //   duration: "-",
        //   qtyToDispense,
        //   action: "Dispense"
        // });
      }
  
      // // Create OpPrescription entry
      // const opPrescription = new OpPrescription({
      //   mrn,
      //   prescription: prescriptionArray,
      //   clinicId: req.user.id
      // });
  
      // await opPrescription.save();

      //-------------------------------------------------------------------------------------------------

      //writing the code for creating the bill and storing it

          const clinicId = req.user.id; // Assuming user is clinic admin
  
          // Fetch clinic details
          const clinic = await Clinic.findById(clinicId);
          if (!clinic) {
              return res.status(404).json({ message: "Clinic not found" });
          }
  
          // Fetch invoice details
          const invoice = await InvoiceNumber.findOne({ clinicId });
          if (!invoice) {
              return res.status(404).json({ message: "Invoice details not found" });
          }
  
          // Fetch patient details
          const patient = await Patient.findOne({ mrn : mrn, clinicId : clinicId });
          if (!patient) {
              return res.status(404).json({ message: "Patient not found" });
          }
  
          // Fetch invoice design settings
          const printSettings = await ConsultationPrint.findOne({ clinicId });
          if (!printSettings) {
              return res.status(404).json({ message: "Print settings not found" });
          }
  
          // Extract settings
          const { fontSize, spaceBetweenLines } = printSettings.basicSettings;
          const { type: headerType, text: headerText, imageUrl: headerImage } = printSettings.bannerHeading.headerBanner;
          const { type: footerType, text: footerText, imageUrl: footerImage } = printSettings.footerBanner.footerBanner;
  
          const savedOpPrescriptionBill = new OpPrescriptionBill({
              mrn : mrn,
              clinicDetails : {
                  name : clinic.clinicName,
                  email : clinic.email,
                  address : clinic.address,
                  phone : clinic.phone_number,
              },
              invoiceDetails : {
                  invoiceNumber : invoice.invoiceNumber,
                  date : new Date(),
                  type : "OpPrescription",
              },
              patientDetails : {
                  name : patient.givenName + " " + patient.middleName + " " + patient.familyName,
                  age : patient.age,
                  gender : patient.gender,
                  mrn : patient.mrn,
              },
              prescription : prescriptionArray,
              billDetails : {
                subTotal : subtotal,
                discount : 0,
                totalGst : totalGst,
                payableAmount : subtotal,
              },
              clinicId : req.user.id,     
          });

          await savedOpPrescriptionBill.save();
      
          const newInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
              { clinicId },
              { $inc: { invoiceNumber: 1 } },
              { new: true }
          );
          newInvoiceNumber.save();

      //-------------------------------------------------------------------------------------------

      res.status(200).json({
        message: "Billing completed successfully",
        printSettings : printSettings,
        billDetails : savedOpPrescriptionBill,
      });
  
    } catch (error) {
      console.error("Billing error:", error);
      res.status(500).json({ message: error.message });
    }
  };
  

  ///This api is for the side flow in the OPprescription
  export const searchPatient = async (req, res) => {
    try {
      const { query } = req.query;
  
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
  
      const searchRegex = new RegExp(query, "i");
  
      const patients = await Patient.find({
        $or: [
          { mrn: query },
          { givenName: searchRegex },
          { phone: searchRegex },
        ],
      }).limit(20); // Optional: limit to avoid large responses
  
      if (patients.length === 0) {
        return res.status(404).json({ message: "No patients found." });
      }
  
      res.status(200).json({ patients });
    } catch (error) {
      console.error("Error in searchPatient:", error);
      res.status(500).json({ message: "Server error" });
    }
  };