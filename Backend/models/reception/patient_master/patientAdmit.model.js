import mongoose, { Schema } from "mongoose";

const patientAdmitSchema = new Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient", // Reference to the Patient model
            required: true,
        },
        // ipNumber: {
        //     type:Number,
        //     required: true,
        // },
        patientDetails: {
            mrn: { type: Number, required: true },
            name: { type: String, required: true },
            age: { type: Number, required: true },
            gender: {
                type: String,
                enum: ["Male", "Female", "Other"],
                required: true,
            },
            contact: { type: String, required: true },
            // address: { type: String, required: true },
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Validates HH:MM format (24-hour)
                },
                message: "Time must be in HH:MM format",
            },
        },
        doctor: {
            type: String,
            required: true,
        },
        reasonForAdmit: {
            type: String,
            required: true,
        },
        bed: {
            ward: { type: String, required: true },
            roomType: {
                type: String,
                // enum: ["General", "Semi-Private", "Private", "ICU"],
                required: true,
            },
            roomNumber:{
                type: Number,
            },
            bedNumber: {
                type: Number,
            },
            bedCharges:{
                type: Number,
            }
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },
    },
    { timestamps: true }
);

const PatientAdmit = mongoose.model("PatientAdmit", patientAdmitSchema);
export default PatientAdmit;
