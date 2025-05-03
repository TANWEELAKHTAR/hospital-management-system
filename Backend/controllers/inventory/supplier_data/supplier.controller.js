import Supplier from "../../../models/inventory/supplier_data/supplier.model.js";
import mongoose from "mongoose";

const addSupplier = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const {
            name,
            gstNumber,
            regionType,
            phoneNumber,
            address,
            city,
            state,
            pinCode,
            dueDate, // Accept dueDate directly
            dueDateForBill, // Also accept dueDateForBill from frontend
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !gstNumber ||
            !regionType ||
            !phoneNumber
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing.",
            });
        }

        // For development, don't check for existing suppliers
        // This allows us to create test data more easily

        // Get clinicId from user or use a default for development
        const clinicId = req.user?.id || '123456789012345678901234';
        console.log("Using clinicId:", clinicId);

        // Use either dueDate from the request or dueDateForBill
        const finalDueDate = dueDate || dueDateForBill || "45 days after bill date";

        // Create and save the new supplier
        const newSupplier = await Supplier.create({
            name,
            gstNumber,
            regionType,
            phoneNumber,
            address: address || "",
            city: city || "",
            state: state || "",
            pinCode: pinCode || "",
            dueDate: finalDueDate,
            clinicId,
        });

        res.status(201).json({
            success: true,
            message: "Supplier added successfully!",
            data: newSupplier,
        });
    } catch (error) {
        console.error("Error adding supplier:", error.message);
        res.status(500).json({
            success: false,
            message: "Error adding supplier",
            error: error.message,
        });
    }
};

const getSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching supplier with id:", id);

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Supplier ID format.",
            });
        }

        // Find supplier by ID without clinicId filter for development
        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res
                .status(404)
                .json({ success: false, message: "Supplier not found." });
        }

        console.log("Found supplier:", supplier);
        res.status(200).json({ success: true, data: supplier });
    } catch (error) {
        console.error("Error fetching supplier:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching supplier",
            error: error.message,
        });
    }
};

const allSuppliers = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            name,
            regionType,
            city,
            state,
            gstNumber,
        } = req.query;

        console.log("Fetching all suppliers");

        // Convert page & limit to integers
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        // Get clinicId from user or use a default for development
        const clinicId = req.user?.id || '123456789012345678901234';
        console.log("Using clinicId for fetching suppliers:", clinicId);

        // For development, don't filter by clinicId
        // This allows us to see all suppliers during development
        let filter = {};

        if (name) filter.name = new RegExp(name, "i"); // Case-insensitive search
        if (regionType) filter.regionType = regionType;
        if (city) filter.city = new RegExp(city, "i");
        if (state) filter.state = new RegExp(state, "i");
        if (gstNumber) filter.gstNumber = gstNumber;

        console.log("Using filter:", filter);

        // Fetch all suppliers without pagination for development
        const suppliers = await Supplier.find(filter).sort({ createdAt: -1 });

        console.log(`Found ${suppliers.length} suppliers`);

        res.status(200).json({
            success: true,
            totalSuppliers: suppliers.length,
            data: suppliers,
        });
    } catch (error) {
        console.error("Error fetching suppliers:", error.message);
        res.status(500).json({
            success: false,
            message: "Error fetching suppliers",
            error: error.message,
        });
    }
};

const editSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log("Updating supplier with id:", id);
        console.log("Update data:", updateData);

        // Handle dueDateForBill field from frontend
        if (updateData.dueDateForBill && !updateData.dueDate) {
            updateData.dueDate = updateData.dueDateForBill;
            delete updateData.dueDateForBill;
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid Supplier ID format.",
                });
        }

        // For development, don't check if supplier exists
        // This simplifies testing

        // Update supplier
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Return updated document
                runValidators: true, // Ensure validation rules are applied
            }
        );

        if (!updatedSupplier) {
            return res
                .status(404)
                .json({ success: false, message: "Supplier not found." });
        }

        console.log("Updated supplier:", updatedSupplier);

        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            data: updatedSupplier,
        });
    } catch (error) {
        console.error("Error updating supplier:", error.message);
        res.status(500).json({
            success: false,
            message: "Error updating supplier",
            error: error.message,
        });
    }
};

export { addSupplier, getSupplier, allSuppliers, editSupplier };
