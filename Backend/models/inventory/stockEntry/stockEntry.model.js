import mongoose from "mongoose";
import { Schema } from "mongoose";

const stockEntrySchema = new Schema({
    supplier : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Supplier",
        required : true,
    },
    invoiceNumber : {
        type : Number,
        required : true,
    },
    invoiceDate : {
        type : Date,
        required : true,
    },
    dueDate : {
        type : Date,
        required : true, 
    },
    itemDetails : {
        type : [{
            drug : {
                type : String,
                required : true,
            },
            batchNumber : {
                type : String,
                required : true,
            },
            expiryDate : {
                type : Date,
                required : true,
            },
            mrp : {
                type : Number,
                required : true,
            },
            ptr : {
                type : Number,
                required : true,
            },
            quantity : {
                type : Number,
                required : true,
            },
            freeQuantity : {
                type : Number,
                required : true,
            },
            disc : {
                type : Number,
                required : true,
            },
            amount : {
                type : Number,
                required : true,
            },
        }],
        required : true,
    },
    status : {
        type : String,
        enum : ["Pending", "Verified"],
        required : true,
    },
    totalItems : {
        type : Number,
    },
    totalValue : {
        type : Number,
    },
    totalGST : {
        type : Number,
    },
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
    },
});

const StockEntry = mongoose.model("StockEntry", stockEntrySchema);

export default StockEntry;