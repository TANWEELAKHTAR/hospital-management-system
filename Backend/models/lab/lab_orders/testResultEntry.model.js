import mongoose, { Schema } from "mongoose";

const individualTestSchema = new Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    results: {
        type: Map,
        of: mongoose.Schema.Types.Mixed, // e.g., { "WBC Count": "4500", "Hemoglobin": "14.2" }
        required: true,
    },
});

const testResultSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
    },
    reports: {
        type: [individualTestSchema],
        default: [],
    },
},{timestamps:true});

const TestResult = mongoose.model("TestResult", testResultSchema);

export default TestResult;
