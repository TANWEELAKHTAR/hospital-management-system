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
        console.log("Request body:", req.body);
        const { supplier, invoiceNumber, invoiceDate, dueDate, itemDetails, status, totalItems: providedTotalItems, totalValue: providedTotalValue } = req.body;

        if (!supplier || !invoiceNumber || !invoiceDate || !dueDate || !itemDetails || itemDetails.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // For development, use a hardcoded clinic ID if not available
        const clinicId = req.user?.id || '123456789012345678901234';
        console.log("Using clinicId:", clinicId);

        // Find supplier by name without clinicId filter for development
        const supplierData = await Supplier.findOne({ name: supplier });
        if (!supplierData) {
            console.log("Supplier not found, creating a new one");
            // Create a new supplier if not found (for development purposes)
            const newSupplier = new Supplier({
                name: supplier,
                gstNumber: "DUMMY" + Date.now(),
                regionType: "Local",
                phoneNumber: "1234567890",
                address: "Development Address",
                dueDate: "45 days after bill date",
                clinicId
            });
            await newSupplier.save();
            console.log("Created new supplier:", newSupplier);
            var supplierToUse = newSupplier;
        } else {
            console.log("Found supplier:", supplierData);
            var supplierToUse = supplierData;
        }

        // Get latest invoice number without clinicId filter for development
        let invoiceData = await InvoiceNumber.findOne();
        if (!invoiceData) {
            // Create new invoice number if not exists
            invoiceData = new InvoiceNumber({
                invoiceNumber: 1000,
                clinicId
            });
            await invoiceData.save();
            console.log("Created new invoice number:", invoiceData);
        }

        // Increment invoice number
        const newInvoiceNumber = parseInt(invoiceNumber) || (invoiceData.invoiceNumber + 1);
        console.log("New invoice number:", newInvoiceNumber);

        // Calculate totals
        let totalGST = 0;

        // Use provided values or calculate them
        const totalItems = providedTotalItems || itemDetails.reduce((acc, item) => acc + parseInt(item.quantity || 0), 0);
        const totalValue = providedTotalValue || itemDetails.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);

        // Skip GST calculation for development
        console.log("Calculated totals:", { totalItems, totalValue, totalGST });

        // Create Stock Entry with updated invoice number
        const stockEntry = new StockEntry({
            supplier: supplierToUse._id,
            invoiceNumber: newInvoiceNumber,
            invoiceDate,
            dueDate,
            itemDetails,
            status: status || "Verified",
            totalItems,
            totalValue,
            totalGST,
            clinicId
        });

        await stockEntry.save();
        console.log("Stock entry saved:", stockEntry);

        // Update InvoiceNumber model to reflect new latest invoice
        await InvoiceNumber.updateOne(
            {},
            { $set: { invoiceNumber: newInvoiceNumber } }
        );
        console.log("Invoice number updated");

        res.status(201).json({ message: "Stock added successfully", stockEntry });
    } catch (error) {
        console.error("Error adding stock:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllStocks = async (req, res) => {
    try {
        // For development, use a hardcoded clinic ID if not available
        const clinicId = req.user?.id || '123456789012345678901234';
        console.log('Fetching stocks with clinicId:', clinicId);

        // Fetch all stocks without clinicId filter during development
        const stocks = await StockEntry.find().populate("supplier");
        console.log(`Found ${stocks.length} stock entries`);

        res.status(200).json(stocks);
    } catch (error) {
        console.error('Error fetching stocks:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getStockById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching stock with id:', id);

        // For development, don't filter by clinicId
        const stock = await StockEntry.findById(id).populate("supplier");
        if (!stock) return res.status(404).json({ message: "Stock entry not found" });

        console.log('Found stock:', stock);
        res.status(200).json(stock);
    } catch (error) {
        console.error('Error fetching stock by id:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { supplier, itemDetails, totalItems: providedTotalItems, totalValue: providedTotalValue } = req.body;

        console.log("Updating stock with id:", id);
        console.log("Update data:", req.body);

        // For development, use a hardcoded clinic ID if not available
        const clinicId = req.user?.id || '123456789012345678901234';

        // Fetch existing stock entry without clinicId filter for development
        const existingStock = await StockEntry.findById(id);
        if (!existingStock) {
            return res.status(404).json({ message: "Stock entry not found" });
        }

        console.log("Found existing stock:", existingStock);
        let updatedData = { ...existingStock.toObject(), ...req.body };

        // Convert supplier name to ObjectId if supplier is provided
        if (supplier) {
            // Find supplier without clinicId filter for development
            const supplierData = await Supplier.findOne({ name: supplier });
            if (!supplierData) {
                console.log("Supplier not found, creating a new one");
                // Create a new supplier if not found (for development purposes)
                const newSupplier = new Supplier({
                    name: supplier,
                    gstNumber: "DUMMY" + Date.now(),
                    regionType: "Local",
                    phoneNumber: "1234567890",
                    address: "Development Address",
                    dueDate: "45 days after bill date",
                    clinicId
                });
                await newSupplier.save();
                console.log("Created new supplier:", newSupplier);
                updatedData.supplier = newSupplier._id;
            } else {
                console.log("Found supplier:", supplierData);
                updatedData.supplier = supplierData._id;
            }
        }

        // Recalculate totalItems, totalValue, and totalGST if itemDetails are updated
        if (itemDetails) {
            // Use provided values or calculate them
            updatedData.totalItems = providedTotalItems ||
                itemDetails.reduce((acc, item) => acc + parseInt(item.quantity || 0), 0);

            updatedData.totalValue = providedTotalValue ||
                itemDetails.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);

            // Skip GST calculation for development
            updatedData.totalGST = 0;
        }

        console.log("Updated data:", updatedData);

        // Update stock entry
        const stock = await StockEntry.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

        console.log("Stock updated:", stock);
        res.status(200).json({ message: "Stock updated successfully", stock });
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ message: error.message });
    }
};


export const deleteStock = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting stock with id:', id);

        // For development, don't filter by clinicId
        const stock = await StockEntry.findByIdAndDelete(id);

        if (!stock) return res.status(404).json({ message: "Stock entry not found" });

        console.log('Deleted stock:', stock);
        res.status(200).json({ message: "Stock deleted successfully" });
    } catch (error) {
        console.error('Error deleting stock:', error);
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
