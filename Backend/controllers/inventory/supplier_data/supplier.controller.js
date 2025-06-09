import Supplier from "../../../models/inventory/supplier_data/supplier.model.js";

const addSupplier = async (req, res) => {
    try {
        const {
            name,
            gstNumber,
            regionType,
            phoneNumber,
            address,
            city,
            state,
            pinCode,
            dueDate,
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !gstNumber ||
            !regionType ||
            !phoneNumber ||
            !address ||
            !dueDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing.",
            });
        }

        // Check if a supplier with the same GST number or phone number already exists
        const existingSupplier = await Supplier.findOne({
            $or: [{ gstNumber }, { phoneNumber }],
        });

        if (existingSupplier) {
            return res.status(409).json({
                success: false,
                message:
                    "Supplier with this GST number or phone number already exists.",
            });
        }
        const clinicId = req.user.id;
        if (!clinicId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Clinic ID not found in user data.",
            });
        }

        // // Calculate dueDate as "45 days after YYYY-MM-DD"
        // const dueDateObj = new Date(billDate);
        // dueDateObj.setDate(dueDateObj.getDate() + 45);
        // const formattedDate = dueDateObj.toISOString().split("T")[0];
        // const dueDate = `45 days after ${formattedDate}`;

        // Create and save the new supplier
        const newSupplier = await Supplier.create({
            name,
            gstNumber,
            regionType,
            phoneNumber,
            address,
            city,
            state,
            pinCode,
            dueDate,
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
        const clinicId = req.user.id;
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Supplier ID format.",
            });
        }

        // Find supplier by ID
        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res
                .status(404)
                .json({ success: false, message: "Supplier not found." });
        }

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

        // Convert page & limit to integers
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const clinicId = req.user.id;
        // Create a filter object based on query params
        let filter = { clinicId };
        if (name) filter.name = new RegExp(name, "i"); // Case-insensitive search
        if (regionType) filter.regionType = regionType;
        if (city) filter.city = new RegExp(city, "i");
        if (state) filter.state = new RegExp(state, "i");
        if (gstNumber) filter.gstNumber = gstNumber;

        // Count total documents for pagination
        const totalSuppliers = await Supplier.countDocuments(filter);

        // Fetch filtered & paginated suppliers
        const suppliers = await Supplier.find(filter)
            .sort({ createdAt: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            success: true,
            totalSuppliers,
            totalPages: Math.ceil(totalSuppliers / limit),
            currentPage: page,
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

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Invalid Supplier ID format.",
                });
        }

        // Check if supplier exists
        const existingSupplier = await Supplier.findById(id);
        if (!existingSupplier) {
            return res
                .status(404)
                .json({ success: false, message: "Supplier not found." });
        }

        // Update supplier
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Return updated document
                runValidators: true, // Ensure validation rules are applied
            }
        );

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
