import mongoose from "mongoose"

const opPrescriptionSchema = new mongoose.Schema({
    mrn : {
        type : String,
        required : true
    },
    prescription : [
        {
            drug : {
                type : String,
            },
            dosage : {
                type : String,
            },
            frequency : {
                type : String,
            },
            duration : {
                type : String,
            },
            qtyToDispense : {
                type : Number,
            },
            qtyInStock : {
                type : Number,
            },
            action : {
                type : String,
                enum : ["Dispense","Replace"]
            },
            replacedWith : {
                type : String,
            }
        }
    ],
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true, 
    }
})

const OpPrescription = mongoose.model("OpPrescription", opPrescriptionSchema)
export default OpPrescription