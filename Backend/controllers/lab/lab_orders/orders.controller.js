import PatientAdmit from "../../../models/reception/patient_master/patientAdmit.model";
import AdmissionNotes from "../../../models/doctor/Ip_dashboard/ipDashboard.model.js";
const getAdmissionNotesByDetails = async (req, res) => {
    try {
        const {
            patientName,
            age,
            gender,
            phone,
            page = 1,
            limit = 10,
        } = req.query;

        const clinicId = req.user.id; // assuming user object has clinic ID

        let filter = {
            clinicId,
            labTests: {
                $elemMatch: { status: "Ordered" },
            },
        };

        if (patientName) {
            filter.patientName = { $regex: new RegExp(patientName, "i") };
        }

        if (age) filter.age = age;
        if (gender) filter.gender = gender;
        if (phone) filter.phone = phone;

        const total = await AdmissionNotes.countDocuments(filter);

        const notes = await AdmissionNotes.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: notes,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getAdmissionNoteByMRN = async (req, res) => {
    try {
        const { mrn } = req.query;
        const clinicId = req.user.id;

        if (!mrn) {
            return res.status(400).json({ message: "MRN is required" });
        }

        const note = await AdmissionNotes.findOne({ mrn, clinicId });

        if (!note) {
            return res
                .status(404)
                .json({ message: "Admission note not found" });
        }

        res.status(200).json({ data: note });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



export const getOrderedLabTestsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }
    const clinicId = req.user.id;
    // Find admission notes for this patient
    const admission = await AdmissionNotes.findOne({ patientId,clinicId });

    if (!admission) {
      return res.status(404).json({ message: "Admission note not found for this patient" });
    }

    // Filter only the lab tests with status "Ordered"
    const orderedTests = admission.labTests.filter(test => test.status === "Ordered");

    res.status(200).json({
      patientId,
      totalOrdered: orderedTests.length,
      labTests: orderedTests,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const markAllLabTestsAsAwaiting = async (req, res) => {
  try {
    const { patientId } = req.params;
    const clinicId = req.user.id;
    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const admissionNote = await AdmissionNotes.findOne({ patientId,clinicId });

    if (!admissionNote) {
      return res.status(404).json({ message: "Admission note not found for this patient" });
    }

    let updatedCount = 0;

    admissionNote.labTests.forEach((labTest) => {
      if (labTest.status === "Ordered") {
        labTest.status = "Awaiting result";
        updatedCount++;
      }
    });

    if (updatedCount === 0) {
      return res.status(200).json({ message: "No lab tests with status 'Ordered' found." });
    }

    await admissionNote.save();

    res.status(200).json({
      message: `'${updatedCount}' lab test(s) updated to 'Awaiting result'`,
      updatedLabTests: admissionNote.labTests.filter(lab => lab.status === "Awaiting result"),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export {getAdmissionNotesByDetails,getAdmissionNoteByMRN,markAllLabTestsAsAwaiting};
