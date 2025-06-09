import mongoose from "mongoose";

const otMastersSchema = new mongoose.Schema({
    identifier : {
        type : String,
    },
    type : {
        type : String,
        required : true
    },
    capacity : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ["Active", "Inactive"], 
        required : true
    },
    equipment : [
        {
            equipmentName : {
                type : String,
            },
            quantity : {
                type : Number,
            }
        }
    ],
    timings : [
        {
            day : {
                type : String,
            },
            inTime : {
                type : String,
            },
            outTime : {
                type : String,
            }
        }
    ],
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Clinic",
        required : true
    }
}); 

const OtMasters = mongoose.model("OtMasters", otMastersSchema);
export default OtMasters;