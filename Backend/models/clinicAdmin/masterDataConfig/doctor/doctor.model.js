import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        registrationNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        qualification: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        timing: {
            days: {
                type: [String], // Array of days (Monday, Tuesday, etc.)
                required: true,
            },
            inTime: {
                type: String,
                required: true,
                match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid 24-hour format (HH:mm)"],
            },
            outTime: {
                type: String,
                required: true,
                match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid 24-hour format (HH:mm)"],
            },
        },
        consultationFee: {
            type: Number,
            required: true,
            min: 0,
        },
        registrationFee: {
            type: Number,
            required: true,
            min: 0,
        },
        emergencyFee: {
            type: Number,
            required: true,
            min: 0,
        },
        validityDays: {
            type: Number,
            required: true,
        },
        validityVisits: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            unique: true,
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

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
