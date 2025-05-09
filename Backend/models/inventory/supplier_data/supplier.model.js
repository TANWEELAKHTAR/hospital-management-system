import mongoose, { Schema } from "mongoose";

const supplierSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        gstNumber: {
            type: String,
            required: true,
        },
        regionType: {
            type: String,
            required: true,
            enum: ["Local", "Non-local"],
        },
        phoneNumber: {
            type: String, // Changed from Number to String to handle phone numbers better
            required: true,
            // Removed unique constraint for development
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        pinCode: {
            type: String,
        },
        dueDate: {
            type: String,
            required: true,
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },
    },
    { timestamps: true }
);

const Supplier=new mongoose.model("Supplier",supplierSchema)

export default Supplier;