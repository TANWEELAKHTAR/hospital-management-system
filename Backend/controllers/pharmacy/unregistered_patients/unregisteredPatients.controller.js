import UnregisteredPatientBilling from "../../../models/pharmacy/unregistered_patients/unregisteredPatients.model.js";
import StockEntry from "../../../models/inventory/stockEntry/stockEntry.model.js";
import mongoose from "mongoose";
const createUnregisteredPatientBill = async (req, res) => {
    try {
      const { patient, drugs } = req.body;
      const clinicId = req.user.id;
  
      const updatedDrugs = [];
  
      for (const drug of drugs) {
        const { name, batchNumber, quantity,discountPercent=0 } = drug;
  
        const stock = await StockEntry.findOne({
          status: "Verified",
          "itemDetails.drug": name,
          "itemDetails.batchNumber": batchNumber,
        });
  
        if (!stock) {
          return res.status(404).json({ message: `No verified stock found for ${name} (Batch: ${batchNumber})` });
        }
  
        const item = stock.itemDetails.find(
          (i) => i.drug === name && i.batchNumber === batchNumber
        );
  
        if (!item || item.quantity < quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${name} (Available: ${item ? item.quantity : 0}, Requested: ${quantity})`,
          });
        }
  
        // item.quantity -= quantity;
        // await stock.save();
  
        // Calculate amount after discount
        const mrp = item.mrp;
        // const gstPercent = item.ptr; // You can replace this if gst exists
  
        const discountedPrice = mrp - (mrp * discountPercent) / 100;
        const amount = discountedPrice * quantity;
  
        updatedDrugs.push({
          ...drug,
          mrp,
        //   gstPercent,
          amount,
        });
      }
  
      // Check if a bill already exists
      const existingBill = await UnregisteredPatientBilling.findOne({
        "patient.name": patient.name,
        "patient.age": patient.age,
        "patient.sex": patient.sex,
        "patient.phone": patient.phone,
        clinicId,
      });
  
      if (existingBill) {
        existingBill.drugs.push(...updatedDrugs);
        existingBill.totalItems += updatedDrugs.length;
        existingBill.totalAmount += updatedDrugs.reduce((sum, drug) => sum + (drug.amount || 0), 0);
        await existingBill.save();
  
        return res.status(200).json({ message: "Drugs added to existing bill", bill: existingBill });
      }
  
      // Create new bill
      const totalItems = updatedDrugs.length;
      const totalAmount = updatedDrugs.reduce((sum, drug) => sum + (drug.amount || 0), 0);
  
      const newBill = new UnregisteredPatientBilling({
        patient,
        drugs: updatedDrugs,
        clinicId,
        totalItems,
        totalAmount,
      });
  
      await newBill.save();
  
      return res.status(201).json({ message: "Bill created successfully", bill: newBill });
    } catch (error) {
      console.error("Billing Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  


  const editDrugInUnregisteredPatientBill = async (req, res) => {
    try {
      const { billId, drugId } = req.params;
      const { newQuantity, newDisc } = req.body;
      const clinicId = req.user.id;
  
      // Step 1: Fetch the bill (Corrected from .find() to .findOne())
      const bill = await UnregisteredPatientBilling.findOne({ _id: billId, clinicId });
      if (!bill) return res.status(404).json({ message: "Bill not found" });
  
      // Step 2: Ensure 'drugs' array exists
      if (!bill.drugs || !Array.isArray(bill.drugs)) {
        return res.status(400).json({ message: "No drugs found in bill" });
      }
  
      // Step 3: Find the drug entry
      const drugEntry = bill.drugs.find(drug => drug._id.toString() === drugId);
      if (!drugEntry) return res.status(404).json({ message: "Drug not found in bill" });
  
      const quantityDiff = newQuantity - drugEntry.quantity;
  
      // Step 4: Find the corresponding stock item
      const stock = await StockEntry.findOne({
        status: "Verified",
        "itemDetails.drug": drugEntry.name,
        "itemDetails.batchNumber": drugEntry.batchNumber,
      });
  
      if (!stock) return res.status(404).json({ message: "Stock not found" });
  
      const stockItem = stock.itemDetails.find(
        item => item.drug === drugEntry.name && item.batchNumber === drugEntry.batchNumber
      );
  
      if (!stockItem) return res.status(404).json({ message: "Drug batch not found in stock" });
  
      // Step 5: Check if increasing quantity exceeds available stock
      if (quantityDiff > 0 && stockItem.quantity < quantityDiff) {
        return res.status(400).json({
          message: `Insufficient stock (Available: ${stockItem.quantity}, Needed: ${quantityDiff})`,
        });
      }
  
    //   // Step 6: Update stock
    //   stockItem.quantity -= quantityDiff;
    //   await stock.save();
  
      // Step 7: Update drug entry
      drugEntry.quantity = newQuantity;
      drugEntry.discountPercent = newDisc;
  
      const mrp = drugEntry.mrp || 0;
      const discount = newDisc || drugEntry.discountPercent || 0;
  
      const discountedPrice = mrp - (mrp * discount) / 100;
      const amount = discountedPrice * newQuantity;
      drugEntry.amount = amount;
  
      // Step 8: Recalculate total amount in bill
      bill.totalAmount = bill.drugs.reduce((sum, d) => sum + (d.amount || 0), 0);
      bill.totalItems = bill.drugs.reduce((sum, d) => sum + (d.quantity || 0), 0);
  
      await bill.save();
  
      res.status(200).json({ message: "Drug updated successfully", updatedDrug: drugEntry });
    } catch (error) {
      console.error("Error editing drug:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

const getDrugsByUnregisteredPatientBillId = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await UnregisteredPatientBilling.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ drugs: bill.drugs });
  } catch (error) {
    console.error("Error fetching drugs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteDrugFromUnregisteredPatientBill = async (req, res) => {
  try {
    const { billId, drugId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(billId) || !mongoose.Types.ObjectId.isValid(drugId)) {
      return res.status(400).json({ message: "Invalid billId or drugId" });
    }

    // Find the bill
    const bill = await UnregisteredPatientBilling.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const originalLength = bill.drugs.length;

    // Remove drug by its ObjectId
    bill.drugs = bill.drugs.filter(drug => drug._id.toString() !== drugId);

    if (bill.drugs.length === originalLength) {
      return res.status(404).json({ message: "Drug not found in the bill" });
    }

    // Recalculate totals
    bill.totalItems = bill.drugs.length;
    bill.totalAmount = bill.drugs.reduce((sum, drug) => sum + (drug.amount || 0), 0);

    await bill.save();

    return res.status(200).json({ message: "Drug deleted successfully", bill });
  } catch (error) {
    console.error("Delete Drug Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




export {createUnregisteredPatientBill,editDrugInUnregisteredPatientBill,getDrugsByUnregisteredPatientBillId,deleteDrugFromUnregisteredPatientBill};