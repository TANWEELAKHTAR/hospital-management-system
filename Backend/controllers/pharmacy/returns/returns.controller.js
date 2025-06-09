import mongoose from "mongoose";
import OpPrescriptionBill from "../../../models/billing/opPrescriptionBill/opPrescriptionBill.model.js";
import Clinic from "../../../models/superAdmin/clinic.model.js";
import Patient from "../../../models/reception/new_patient_reg/newPatient.model.js";
import InvoiceNumber from "../../../models/superAdmin/invoiceNumber.model.js";
import ConsultationPrint from "../../../models/clinicAdmin/masterDataConfig/printSettings/consultationPrint/consultationPrint.model.js";
import ReturnsBill from "../../../models/billing/returnsBill/returnsBill.model.js";

//The first api is to direclty just search for the bill number 
//The second api is for matching, like to fetch bills
//with number 1234,12345,123456 even if only 123 is entered

// export const searchBillsByInvoiceNumber = async (req, res) => {
//     try {
//       const { query } = req.query;
//       const clinicId = req.user.id;
//       if (!query || isNaN(query)) {
//         return res.status(400).json({ message: "A valid numeric invoice number is required" });
//       }
    
//       const matchingBills = await OpPrescriptionBill.find({
//         "invoiceDetails.invoiceNumber": query,
//         clinicId: clinicId, // Ensure we filter bills only for this clinic
//       });
  
//       if (matchingBills.length === 0) {
//         return res.status(404).json({ message: "No matching bills found" });
//       }
  
//       res.status(200).json({ bills: matchingBills });
//     } catch (error) {
//       console.error("Error in searchBillsByInvoiceNumber:", error);
//       res.status(500).json({ message: "Server error" });
//     }
// };

// export const searchBillsByInvoiceNumber = async (req, res) => {
//     try {
//       const { query } = req.query;
//       const clinicId = req.user.id;
  
//       if (!query || isNaN(query)) {
//         return res.status(400).json({ message: "A valid numeric invoice number is required" });
//       }
  
//       const matchingBills = await OpPrescriptionBill.aggregate([
//         {
//           $match: {
//             clinicId: new mongoose.Types.ObjectId(clinicId)
//           }
//         },
//         {
//           $addFields: {
//             invoiceNumberStr: {
//               $toString: "$invoiceDetails.invoiceNumber"
//             }
//           }
//         },
//         {
//           $match: {
//             invoiceNumberStr: { $regex: `^${query}` }
//           }
//         }
//       ]);
  
//       if (matchingBills.length === 0) {
//         return res.status(404).json({ message: "No matching bills found" });
//       }
  
//       res.status(200).json({ bills: matchingBills });
  
//     } catch (error) {
//       console.error("Error in searchBillsByInvoiceNumber:", error);
//       res.status(500).json({ message: "Server error" });
//     }
// };

//This is the final modified api, which also provides you which drug is refundable 
//and which isnt in the same api call itself, thereby reducing backend api calls

export const searchBillsByInvoiceNumber = async (req, res) => {
  try {
    const { query } = req.query;
    const clinicId = String(req.user.id);

    if (!query || isNaN(query)) {
      return res.status(400).json({ message: "A valid numeric invoice number is required" });
    }

    const matchingBills = await OpPrescriptionBill.aggregate([
      {
        $match: {
          clinicId: new mongoose.Types.ObjectId(clinicId)
        }
      },
      {
        $addFields: {
          invoiceNumberStr: {
            $toString: "$invoiceDetails.invoiceNumber"
          }
        }
      },
      {
        $match: {
          invoiceNumberStr: { $regex: `^${query}` }
        }
      },
      {
        $unwind: "$prescription"
      },
      {
        $lookup: {
          from: "drugs", 
          localField: "prescription.drug",
          foreignField: "name",
          as: "drugInfo"
        }
      },
      {
        $addFields: {
          "prescription.refundableMaterial": {
            $cond: [
              { $gt: [{ $size: "$drugInfo" }, 0] },
              { $arrayElemAt: ["$drugInfo.refundableMaterial", 0] },
              "unknown"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          mrn: { $first: "$mrn" },
          clinicDetails: { $first: "$clinicDetails" },
          invoiceDetails: { $first: "$invoiceDetails" },
          patientDetails: { $first: "$patientDetails" },
          prescription: { $push: "$prescription" },
          billDetails: { $first: "$billDetails" },
          clinicId: { $first: "$clinicId" },
          __v: { $first: "$__v" },
          invoiceNumberStr: { $first: "$invoiceNumberStr" }
        }
      }
    ]);

    if (matchingBills.length === 0) {
      return res.status(404).json({ message: "No matching bills found" });
    }

    res.status(200).json({ bills: matchingBills });

  } catch (error) {
    console.error("Error in searchBillsByInvoiceNumber:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//-------------------------------------------------------------------
//Returns bill api yet to be written and generated
