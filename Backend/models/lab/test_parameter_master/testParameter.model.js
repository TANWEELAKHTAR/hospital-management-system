import mongoose, { Schema } from "mongoose";

const NormalRangeSchema = new Schema({
    gender: { type: String, enum: ["Male", "Female", "All"], required: true },
    specialCondition: { type: String, default: "" },
    age: { type: String, required: true },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
});

const TestParameterSchema = new Schema({
    parameter: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    method: { type: String, required: true },
    normalRanges: [NormalRangeSchema], // Embedded array of normal ranges
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
        index: false,
    },
});

const TestParameter = mongoose.model("TestParameter", TestParameterSchema);

export default TestParameter;
