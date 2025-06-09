import mongoose from "mongoose"

const otScheduledSchema = new mongoose.Schema({
    ot: {
        type : String,
        required : true
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String, // e.g. "10:30"
        required: true,
    },
    bookedBy : {
        type: String,
        required: true
    },
    patientName: {
        type: String,
    },
    procedure: {
        type: String,
    },
    surgicalAssistant : [
        {
            name : {
                type : String
            },
            role : {
                type : String
            }
        }
    ],
    scrubNurse : [
        {
            name : {
                type : String
            },
            role : {
                type : String
            }
        }
    ],
    circulatingNurse : [
        {
            name : {
                type : String
            },
            role : {
                type : String
            }
        }
    ],
    anesthetist : [
        {
            name : {
                type : String
            },
            role : {
                type : String
            }
        }
    ],
    technician : [
        {
            name : {
                type : String
            },
            role : {
                type : String
            }
        }
    ],
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
    },
    status: {
        type: String,
        enum: ["Scheduled", "Completed"],
        default: "Scheduled",
    },
    caseCompletionDetails : {
        inTime : {
            type : String
        },
        outTime : {
            type : String
        },
        completedOn : {
            type : Date
        },
        outcome : {
            type : String
        },
        additionNote : {
            type : String
        },
        patientStatus : {
            type : String
        }
    }
}, { timestamps: true });

const OtScheduled = mongoose.model("OtScheduled", otScheduledSchema);
export default OtScheduled