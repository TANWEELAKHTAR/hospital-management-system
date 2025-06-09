import mongoose from "mongoose";

const drugSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    molecue : {
        type : String,
    },
    manufacturer : {
        type : String,
    },
    category : {
        type : String,
    },
    refundableMaterial : {
        type : String,
        enum : ["Yes", "No"],
    },
    schedule : {
        type : String,
    },
    hsn : {
        type : String,
    },
    packing : {
        type : String,
    },
    weight : {
        type : Number,
    },
    measurement : {
        type : String,
    },
    gst : {
        type : Number,
    },
    mrp : {
        type : Number,
    },
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Clinic",
        required : true
    }
});

const Drug = mongoose.model("Drug", drugSchema);

export default Drug;