import mongoose from "mongoose";

const otRequestSchema = new mongoose.Schema({
    ot : {
        type : String,
        required : true
    },
    patientDetails : {
        name : {
            type : String,
            required : true
        },
        age : {
            type : Number,
            required : true
        },
        gender : {
            type : String,
            required : true
        },
    },
    preferredDate : {
        type : Date,
        required : true
    },
    preferredTime : {
        type : String,
        required : true
    },
    procedure : {
        type : String,
        required : true
    },
    requestedBy : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["Time suggested", "In-Progress", "OT unavailable","Pending"],
        default : "Pending"
    },
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
    },
});

const OtRequest = mongoose.model("OtRequest", otRequestSchema);
export default OtRequest;