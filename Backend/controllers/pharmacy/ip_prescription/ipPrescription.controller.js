import PatientAdmit from "../../../models/reception/patient_master/patientAdmit.model";
import AdmissionNotes from "../../../models/doctor/Ip_dashboard/ipDashboard.model";
import StockEntry from "../../../models/inventory/stockEntry/stockEntry.model";
const allAdmittedPatients = async (req, res) => {
    try {
        const {
            doctor,
            ward,
            date,
            name,
            gender,
            contact,
            page = 1,
            limit = 10,
        } = req.query;
        const clinicId = req.user.id; // Ensure the clinic is scoped to the logged-in user

        let filter = { clinicId };

        // Apply filters dynamically if provided
        if (doctor) filter.doctor = doctor;
        if (ward) filter["bed.ward"] = ward;
        if (date) filter.date = new Date(date); // Ensure correct date format
        if (gender) filter["patientDetails.gender"] = gender;
        if (contact) filter["patientDetails.contact"] = contact;
        if (name)
            filter["patientDetails.name"] = { $regex: new RegExp(name, "i") }; // Case-insensitive search

        // Get total count for pagination
        const totalPatients = await PatientAdmit.countDocuments(filter);

        // Fetch patients with pagination
        const patients = await PatientAdmit.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }) // Sort by latest admissions
            .exec();

        // Check if any patients were found
        if (patients.length === 0) {
            return res
                .status(404)
                .json({ message: "No admitted patients found" });
        }

        res.status(200).json({
            totalPatients,
            page: parseInt(page),
            totalPages: Math.ceil(totalPatients / limit),
            patients,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



const getDispensableMedications = async (req, res) => {
  try {
    const { patientId } = req.params;
    const clinicId = req.uer.id
    const admissionNote = await AdmissionNotes.findOne({ patientId,clinicId }).select("medications");

    if (!admissionNote || !admissionNote.medications.length) {
      return res.status(404).json({ message: "No medications found." });
    }

    const result = await Promise.all(admissionNote.medications.map(async (med) => {
      const [morning, afternoon, night] = med.frequency.split("-").map(Number);
      const timesPerDay = morning + afternoon + night;
      const durationDays = parseInt(med.duration); // Assumes "5 days" => 5
      const totalQty = timesPerDay * durationDays;

      // Query all verified stock entries matching this drug
      const stockEntries = await StockEntry.aggregate([
        { $match: { status: "Verified", "itemDetails.drug": med.drug } }, //not drugName
        { $unwind: "$itemDetails" },
        { $match: { "itemDetails.drug": med.drug } },
        {
          $group: {
            _id: "$itemDetails.drug",
            totalStock: { $sum: "$itemDetails.quantity" },
          },
        },
      ]);

      const availableStock = stockEntries.length ? stockEntries[0].totalStock : 0;

      return {
        drug: med.drug,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        qtyToDispense: `${totalQty} ${med.unit}`,
        inStock: availableStock >= totalQty ? "Yes" : "No",
        // availableStock, not necessary
      };
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error("Error checking stock for medications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export {allAdmittedPatients,getDispensableMedications}