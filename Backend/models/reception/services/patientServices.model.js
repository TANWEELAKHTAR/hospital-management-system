import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const patientServicesSchema = new Schema({
    mrn: {
        type: String,
        required: true,
    },
    addedServices: [
        {
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
            },
            quantity: {
                type: Number,
                default: 1,
            },
            price : {
                type: Number,
                required: true
            },
            totalPrice: {
                type: Number,
                required: true,
            }
        }
    ],
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
    },
});

const PatientServices = mongoose.model("PatientServices", patientServicesSchema);

export default PatientServices;