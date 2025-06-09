import StockAdjustment from "../../../models/inventory/stock_adjustment/stockAdjustment.model.js";
import StockEntry from "../../../models/inventory/stockEntry/stockEntry.model.js";

export const searchStock = async (req, res) => {
    try {
        const { drugName } = req.query;
        if (!drugName) {
            return res.status(400).json({ message: "Drug name is required" });
        }

        // Search for stock entries that contain the drug in itemDetails
        const stockEntries = await StockEntry.find({
            "itemDetails.drug": { $regex: new RegExp(drugName, "i") } // Case-insensitive search
        });

        if (!stockEntries.length) {
            return res.status(404).json({ message: "No matching stock found" });
        }

        // Extract matching items
        const results = stockEntries.flatMap(entry =>
            entry.itemDetails
                .filter(item => item.drug.toLowerCase() === drugName.toLowerCase())
                .map(item => ({
                    batchNumber: item.batchNumber,
                    totalStock: item.quantity + item.freeQuantity
                }))
        );

        if (!results.length) {
            return res.status(404).json({ message: "No matching stock found" });
        }

        res.json(results);
    } catch (error) {
        console.error("Error fetching stock:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addStockAdjustment = async (req, res) => {
    try {
        const { itemName, batchNumber, adjustmentValue, reason } = req.body;

        if (!itemName || !batchNumber || !adjustmentValue || !reason) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find stock entry with matching drug and batch number
        const stockEntry = await StockEntry.findOne({
            "itemDetails.drug": itemName,
            "itemDetails.batchNumber": batchNumber,
            clinicId : req.user.id,
        });

        if (!stockEntry) {
            return res.status(404).json({ message: "Stock entry not found" });
        }

        // Update the stock in itemDetails
        let updated = false;
        stockEntry.itemDetails.forEach(item => {
            if (item.drug === itemName && item.batchNumber === batchNumber) {
                if (item.quantity + adjustmentValue < 0) {
                    return res.status(400).json({ message: "Insufficient stock" });
                }
                item.quantity += adjustmentValue; // Adjust stock
                updated = true;
            }
        });

        if (!updated) {
            return res.status(404).json({ message: "Batch number not found in stock" });
        }

        // Save the updated stock entry
        await stockEntry.save();

        // Create a stock adjustment entry
        const newAdjustment = new StockAdjustment({
            itemName,
            batchNumber,
            currStock: stockEntry.itemDetails.find(item => item.drug === itemName && item.batchNumber === batchNumber).quantity,
            adjustmentValue,
            reason,
            clinicId : req.user.id
        });

        await newAdjustment.save();

        res.status(201).json({ message: "Stock adjusted successfully", newAdjustment });
    } catch (error) {
        console.error("Error adjusting stock:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getStockAdjustments = async (req, res) => {
    try {
        const stockAdjustments = await StockAdjustment.find({ clinicId: req.user.id });
        res.json(stockAdjustments);
    } catch (error) {
        console.error("Error fetching stock adjustments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}