import mongoose, { Schema } from "mongoose";
// import PatientAdmit from "../../reception/patient_master/patientAdmit.model";
const VitalsSchema = new mongoose.Schema({
    dateTime: { type: Date, required: true },
    bp: { type: String, required: true },
    heartRate: { type: String, required: true },
    temp: { type: String, required: true },
    spo2: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    bmi: { type: String, required: true },
});

const LabTestSchema = new mongoose.Schema({
    dateTime: { type: Date, required: true },
    test: { type: String, required: true }, // Keep for display if needed
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    status: {
        type: String,
        enum: ["Ordered", "Awaiting result", "Review Pending", "Result Received"],
        default: "Ordered",
    },
    doneOn: { type: Date },
});


const MedicationSchema = new mongoose.Schema({
    dateTime: { type: Date, required: true },
    drug: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
});

const ObservationSchema = new mongoose.Schema({
    dateTime: { type: Date, required: true },
    note: { type: String, required: true },
});

const AdmissionNotesSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient", // Reference to the Patient model
            required: true,
        },
        patientName: { type: String, required: true },
        mrn: { type: String, required: true, unique: true },
        dob: { type: Date, required: true },
        age: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"],
        },
        admittedOn: { type: Date },
        vitals: [VitalsSchema],
        labTests: [LabTestSchema],
        medications: [MedicationSchema],
        observations: [ObservationSchema],
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },
    },
    { timestamps: true }
);
const AdmissionNotes = new mongoose.model(
    "AdmissionNotes",
    AdmissionNotesSchema
);

export default AdmissionNotes;
