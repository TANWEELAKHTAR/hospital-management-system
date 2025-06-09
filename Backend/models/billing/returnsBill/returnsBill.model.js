import mongoose from "mongoose";

const returnsBillSchema = new mongoose.Schema({
    //Will be given from frontend
    mrn : {
        type : String,
    },
    //Will be fetched using req.user.id which is clinicId
    clinicDetails : {
        name : {
            type : String,
        },
        email : {   
            type : String,
        },
        address : {
            type : String,
        },
        phone : {
            type : String,
        },
    },
    //will be fetched from invoice schema using clinicId
    invoiceDetails : {
        invoiceNumber : {
            type : Number,
        },
        date : {
            type : Date,
        },
        type : {
            type : String
        }
    },
    //We have mrn and using that all the patient details can be fetched
    patientDetails : {
        name : {
            type : String,
        },
        age : {
            type : Number,
        },
        gender : {
            type : String,
        }
    },
    //prescription finalised one will be sent from frontend
    returnItems : [
        {
            drug : {
                type : String,
            },
            returnQty : {
                type : Number,
            },
            batch : {
                type : String,
            },
            mrp : {
                type : Number,
            },
            disc : {
                type : Number,
            },
            gst : {
                type : Number
            },
            amount : {
                type : Number
            },
        }
    ],
    //to be autocalculated based on above information
    billDetails : {
        returnSubTotal : {     //we need to calculate based on the provided prescription array
            type : Number,
        },
        discountReversed : {
            type : Number,
        },
        gstReversed : {     //we need to calculate based on the provided prescription array
            type : Number,
        },
        refundAmount : {  //we need to calculate based on the provided details
            type : Number,
        }
    },
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Clinic",
        required : true,
    }
});

const ReturnsBill = mongoose.model("ReturnsBill", returnsBillSchema);
export default ReturnsBill;