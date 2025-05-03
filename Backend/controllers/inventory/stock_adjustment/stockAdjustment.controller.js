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
        console.log("Request body:", req.body);
        const { itemName, batchNumber, currStock, adjustmentValue, reason } = req.body;

        // Validate required fields
        if (!itemName) {
            return res.status(400).json({ message: "Item name is required" });
        }

        if (!batchNumber) {
            return res.status(400).json({ message: "Batch number is required" });
        }

        if (currStock === undefined) {
            return res.status(400).json({ message: "Current stock is required" });
        }

        if (adjustmentValue === undefined) {
            return res.status(400).json({ message: "Adjustment value is required" });
        }

        if (!reason) {
            return res.status(400).json({ message: "Reason is required" });
        }

        // For development, use a hardcoded clinic ID if not available
        const clinicId = req.user?.id || '123456789012345678901234';
        console.log("Using clinicId:", clinicId);

        // In a real implementation, we would update the actual stock
        // For now, we'll just create the adjustment record
        console.log("Creating stock adjustment record with data:", {
            itemName,
            batchNumber,
            currStock,
            adjustmentValue,
            reason,
            clinicId
        });

        try {
            // Create a stock adjustment entry
            const newAdjustment = new StockAdjustment({
                itemName,
                batchNumber,
                currStock: Number(currStock),
                adjustmentValue: Number(adjustmentValue),
                reason,
                clinicId
            });

            await newAdjustment.save();
            console.log("Stock adjustment saved:", newAdjustment);

            res.status(201).json({ message: "Stock adjusted successfully", stockAdjustment: newAdjustment });
        } catch (dbError) {
            console.error("Database error:", dbError);
            res.status(500).json({ message: `Database error: ${dbError.message}` });
        }
    } catch (error) {
        console.error("Error adjusting stock:", error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

export const getStockAdjustments = async (req, res) => {
    try {
        // For development, don't filter by clinicId
        const stockAdjustments = await StockAdjustment.find().sort({ createdAt: -1 });
        console.log(`Found ${stockAdjustments.length} stock adjustments`);

        res.status(200).json(stockAdjustments);
    } catch (error) {
        console.error('Error fetching stock adjustments:', error);
        res.status(500).json({ message: error.message });
    }
}