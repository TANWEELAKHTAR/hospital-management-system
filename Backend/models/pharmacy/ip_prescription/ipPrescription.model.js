import mongoose,{Schema} from "mongoose";


const PrescriptionDrugSchema = new Schema({
  drug: { type: String, required: true }, // e.g., "Ibuprofen | 400mg"
  batchNumber: { type: String, required: true }, // e.g., "BTCH-12345"
  expiryDate: { type: String, required: true }, // Format: MM/YYYY or MM/YYYY string
  quantity: { type: Number, required: true }, // Quantity issued
  mrp: { type: Number, required: true }, // Maximum Retail Price per unit
  discountPercent: { type: Number, default: 0 }, // Discount in percent
  gstPercent: { type: Number, default: 12 }, // GST in percent
  amount: { type: Number, required: true }, // Final calculated amount after discount
}, { _id: false });

const IPPrescriptionSchema = new Schema({
  ipPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "AdmissionNotes", required: true },
//   ward: { type: String }, // Optional: which ward the patient is in
//   attendingDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }, // optional
  drugs: [PrescriptionDrugSchema],
  totalItems: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  clinicId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Clinic",
              required: true,
          },
//   issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Pharmacist or staff
//   issuedAt: { type: Date, default: Date.now }
},{timestamps:true});

const IPPrescription=new mongoose.model("IPPrescription", IPPrescriptionSchema);

export default IPPrescription;
