import InvoiceNumber from "../../../models/superAdmin/invoiceNumber.model.js";
import StockEntry from "../../../models/inventory/stockEntry/stockEntry.model.js";
import Supplier from "../../../models/inventory/supplier_data/supplier.model.js";
import Drug from "../../../models/inventory/drug/drug.model.js";

export const getInvoiceDetails = async (req, res) => {
    try {
        const { supplier, invoiceDate } = req.query;
        if (!supplier || !invoiceDate) {
            return res.status(400).json({ message: "Supplier and invoiceDate are required" });
        }

        // Get the invoice number from InvoiceNumber schema
        const invoiceData = await InvoiceNumber.findOne({ clinicId: req.user.id });
        if (!invoiceData) return res.status(404).json({ message: "Invoice number not found" });

        // Get the supplier details to fetch due date format
        const supplierData = await Supplier.findOne({ name: supplier, clinicId: req.user.id });
        if (!supplierData) return res.status(404).json({ message: "Supplier not found" });

        // Extract due days from string (e.g., "15 days after bill")
        const dueDays = parseInt(supplierData.dueDate.split(" ")[0], 10);
        if (isNaN(dueDays)) return res.status(400).json({ message: "Invalid due date format in supplier" });

        // Calculate the due date
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + dueDays);

        res.status(200).json({ invoiceNumber: invoiceData.invoiceNumber, dueDate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveStock = async (req, res) => {
    try {
        const { supplier, invoiceNumber, invoiceDate, dueDate, itemDetails } = req.body;

        if (!supplier || !invoiceNumber || !invoiceDate || !dueDate || !itemDetails || itemDetails.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Fetch Supplier ID
        const supplierData = await Supplier.findOne({ name: supplier, clinicId: req.user.id });
        if (!supplierData) return res.status(404).json({ message: "Supplier not found" });

        // **Fetch the latest invoice number for this clinic**
        const invoiceData = await InvoiceNumber.findOne({ clinicId: req.user.id });

        if (!invoiceData) return res.status(404).json({ message: "Invoice record not found" });

        let latestInvoiceNumber = invoiceData.invoiceNumber;  // Current latest invoice

        // Ensure sequential invoice numbers
        let newInvoiceNumber = invoiceNumber === latestInvoiceNumber ? invoiceNumber + 1 : latestInvoiceNumber + 1;

        // Calculate totals
        let totalGST = 0;
        const totalItems = itemDetails.reduce((acc, item) => acc + item.quantity, 0);
        const totalValue = itemDetails.reduce((acc, item) => acc + item.amount, 0);

        // Calculate GST by fetching it from the Drug schema
        for (const item of itemDetails) {
            const drugData = await Drug.findOne({ name: item.drug, clinicId: req.user.id });

            if (!drugData) {
                return res.status(404).json({ message: `Drug '${item.drug}' not found` });
            }

            const gstAmount = (item.amount * drugData.gst) / 100;
            totalGST += gstAmount;
        }

        // **Create Stock Entry with updated invoice number**
        const stockEntry = new StockEntry({
            supplier: supplierData._id,
            invoiceNumber: newInvoiceNumber,
            invoiceDate,
            dueDate,
            itemDetails,
            status: "Pending",
            totalItems,
            totalValue,
            totalGST,
            clinicId: req.user.id,
        });

        await stockEntry.save();

        // **Update InvoiceNumber model to reflect new latest invoice**
        await InvoiceNumber.updateOne(
            { clinicId: req.user.id },
            { $set: { invoiceNumber: newInvoiceNumber } }
        );

        res.status(201).json({ message: "Stock saved successfully", stockEntry });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addStock = async (req, res) => {
    try {
        const { supplier, invoiceNumber, invoiceDate, dueDate, itemDetails } = req.body;

        if (!supplier || !invoiceNumber || !invoiceDate || !dueDate || !itemDetails || itemDetails.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Fetch Supplier ID
        const supplierData = await Supplier.findOne({ name: supplier, clinicId: req.user.id });
        if (!supplierData) return res.status(404).json({ message: "Supplier not found" });

        // **Fetch the latest invoice number for this clinic**
        const invoiceData = await InvoiceNumber.findOne({ clinicId: req.user.id });

        if (!invoiceData) return res.status(404).json({ message: "Invoice record not found" });

        let latestInvoiceNumber = invoiceData.invoiceNumber;  // Current latest invoice

        // Ensure sequential invoice numbers
        let newInvoiceNumber = invoiceNumber === latestInvoiceNumber ? invoiceNumber + 1 : latestInvoiceNumber + 1;

        // Calculate totals
        let totalGST = 0;
        const totalItems = itemDetails.reduce((acc, item) => acc + item.quantity, 0);
        const totalValue = itemDetails.reduce((acc, item) => acc + item.amount, 0);

        // Calculate GST by fetching it from the Drug schema
        for (const item of itemDetails) {
            const drugData = await Drug.findOne({ name: item.drug, clinicId: req.user.id });

            if (!drugData) {
                return res.status(404).json({ message: `Drug '${item.drug}' not found` });
            }

            const gstAmount = (item.amount * drugData.gst) / 100;
            totalGST += gstAmount;
        }

        // **Create Stock Entry with updated invoice number**
        const stockEntry = new StockEntry({
            supplier: supplierData._id,
            invoiceNumber: newInvoiceNumber,
            invoiceDate,
            dueDate,
            itemDetails,
            status: "Verified",
            totalItems,
            totalValue,
            totalGST,
            clinicId: req.user.id,
        });

        await stockEntry.save();

        // **Update InvoiceNumber model to reflect new latest invoice**
        await InvoiceNumber.updateOne(
            { clinicId: req.user.id },
            { $set: { invoiceNumber: newInvoiceNumber } }
        );

        res.status(201).json({ message: "Stock added successfully", stockEntry });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllStocks = async (req, res) => {
    try {
        const stocks = await StockEntry.find({ clinicId: req.user.id }).populate("supplier");
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStockById = async (req, res) => {
    try {
        const stock = await StockEntry.findOne({ _id: req.params.id, clinicId: req.user.id }).populate("supplier");
        if (!stock) return res.status(404).json({ message: "Stock entry not found" });

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { supplier, itemDetails } = req.body;

        // Fetch existing stock entry
        const existingStock = await StockEntry.findOne({ _id: req.params.id, clinicId: req.user.id });
        if (!existingStock) {
            return res.status(404).json({ message: "Stock entry not found" });
        }

        let updatedData = { ...existingStock.toObject(), ...req.body };

        // Convert supplier name to ObjectId if supplier is provided
        if (supplier) {
            const supplierData = await Supplier.findOne({ name: supplier, clinicId: req.user.id });
            if (!supplierData) return res.status(400).json({ message: "Supplier not found" });
            updatedData.supplier = supplierData._id;
        }

        // Recalculate totalItems, totalValue, and totalGST if itemDetails are updated
        if (itemDetails) {
            updatedData.totalItems = itemDetails.reduce((acc, item) => acc + item.quantity, 0);
            updatedData.totalValue = itemDetails.reduce((acc, item) => acc + item.amount, 0);

            // Fetch GST values for each drug
            const drugs = await Drug.find({
                name: { $in: itemDetails.map(item => item.drug) },
                clinicId: req.user.id
            });

            updatedData.totalGST = itemDetails.reduce((acc, item) => {
                const drug = drugs.find(d => d.name === item.drug);
                return acc + (item.amount * (drug?.gst || 0)) / 100;
            }, 0);
        }

        // Update stock entry
        const stock = await StockEntry.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.status(200).json({ message: "Stock updated successfully", stock });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteStock = async (req, res) => {
    try {
        const stock = await StockEntry.findOneAndDelete({ _id: req.params.id, clinicId: req.user.id });

        if (!stock) return res.status(404).json({ message: "Stock entry not found" });

        res.status(200).json({ message: "Stock deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
    

//This api is to fetch the particular drug and its stock 
//Because it is needed in the doctor module OP queue section
export const searchDrug = async (req, res) => {
    try {
        const { drugName } = req.query; // Drug name from search query

        if (!drugName) {
            return res.status(400).json({ message: "Drug name is required" });
        }

        // Find all stock entries that contain the searched drug name within itemDetails for the specific clinic
        const stockEntries = await StockEntry.find(
            {
                clinicId: req.user.id,
                "itemDetails.drug": { $regex: drugName, $options: "i" }, // Case-insensitive search
            },
            { itemDetails: 1 } // Only fetch itemDetails field
        );

        // Extract matching drugs and their available quantity
        const matchingDrugs = [];
        stockEntries.forEach(entry => {
            entry.itemDetails.forEach(item => {
                if (item.drug.toLowerCase().includes(drugName.toLowerCase())) {
                    matchingDrugs.push({
                        drug: item.drug,
                        availableQuantity: item.quantity + item.freeQuantity, // Total available quantity
                        // batchNumber: item.batchNumber,
                        // expiryDate: item.expiryDate,
                        // mrp: item.mrp,
                        // ptr: item.ptr,
                        clinicId: entry.clinicId
                    });
                }
            });
        });

        if (matchingDrugs.length === 0) {
            return res.status(404).json({ message: "No matching drugs found" });
        }

        res.status(200).json({ matchingDrugs });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
