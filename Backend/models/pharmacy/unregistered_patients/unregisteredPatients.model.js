import mongoose, { Schema } from "mongoose";

const DrugSchema = new Schema({
    name: { type: String, required: true }, // e.g., Cetirizine
    batchNumber: { type: String, required: true }, // e.g., BTH12345
    quantity: { type: Number, required: true }, // e.g., 12
    expiryDate: { type: String, required: true }, // Format: MM/YYYY
    discountPercent: { type: Number, required: true }, // e.g., 6
    mrp: { type: Number, required: false },
    gstPercent: { type: Number, required: false },
    amount: { type: Number, required: false },
});

const unregisteredPatientBillingSchema = new Schema(
    {
        patient: {
            name: { type: String, required: true },
            age: { type: Number, required: true },
            sex: {
                type: String,
                enum: ["Male", "Female", "Other"],
                required: true,
            },
            phone: { type: String, required: true },
            doctorName: { type: String, required: true },
        },
        drugs: [DrugSchema],
        totalItems: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0.0 },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const UnregisteredPatientBilling = new mongoose.model(
    "UnregisteredPatientBilling",
    unregisteredPatientBillingSchema
);

export default UnregisteredPatientBilling;
