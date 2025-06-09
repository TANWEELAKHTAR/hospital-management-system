import mongoose from "mongoose";

const equipmentMasterSchema = new mongoose.Schema({
    equipmentName : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    assignTo : [String],
    status : {
        type : String,
        enum : ["Active", "Inactive"],
        required : true
    },
    clinicId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Clinic",
        required : true,
    }
});

const EquipmentMaster = mongoose.model("EquipmentMaster", equipmentMasterSchema);
export default EquipmentMaster;