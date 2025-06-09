import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
    {
        groupName: { type: String, required: true, unique: true }, // "Complete Blood Count"
        category: { type: String, required: true }, // "Hematology"
        charges: { type: Number, required: true }, // Price in INR
        parameters: [
            { type: mongoose.Schema.Types.ObjectId, ref: "TestParameter" },
        ],
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
            index: false,
        }, // References test parameters
    },
    { timestamps: true }
);


const Group = mongoose.model("Group", groupSchema);
export default Group;
