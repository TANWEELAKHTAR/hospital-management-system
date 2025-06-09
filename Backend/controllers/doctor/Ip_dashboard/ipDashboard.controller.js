import AdmissionNotes from "../../../models/doctor/Ip_dashboard/ipDashboard.model.js";
import PatientAdmit from "../../../models/reception/patient_master/patientAdmit.model.js";
import Patient from "../../../models/reception/new_patient_reg/newPatient.model.js";
import Group from "../../../models/lab/test_parameter_master/group.model.js";
import Drug from "../../../models/inventory/drug/drug.model.js";

const addDetailsToAdmissionNotes = async (req, res) => {
  try {
    const { patientId } = req.params;
    const clinicId = req.user.id;

    const existingPatient = await Patient.findById(patientId);
    if (!existingPatient) {
      return res
        .status(404)
        .json({ success: false, message: "No patient exists with this ID" });
    }

    const admittedPatient = await PatientAdmit.findOne({ patientId, clinicId });
    if (!admittedPatient) {
      return res
        .status(400)
        .json({ success: false, message: "This patient is not admitted" });
    }

    const { vitals, labTests, medications, observations } = req.body;
    const { mrn, dateOfBirth: dob, age, email, phone, name: patientName ,gender} = existingPatient;
    const admittedOn = admittedPatient.date;

    if (!mrn) {
      return res.status(400).json({ message: "MRN is required" });
    }

    // 🔍 Validate all labTests against Group schema
    if (labTests && labTests.length > 0) {
      for (const test of labTests) {
        const testGroup = await Group.findOne({
          groupName: test.test,
          clinicId,
        });
        if (!testGroup) {
          return res.status(400).json({
            success: false,
            message: `Test "${test.test}" does not exist as a group in lab tests.`,
          });
        }
      }
    }

    // 🔍 Validate all medications against Drug schema
    if (medications && medications.length > 0) {
      for (const med of medications) {
        const drugExists = await Drug.findOne({
          name: med.drug,
          clinicId,
        });
        if (!drugExists) {
          return res.status(400).json({
            success: false,
            message: `Drug "${med.drug}" does not exist in the drug list for this clinic.`,
          });
        }
      }
    }

    // 🔄 Find or create admission note
    let admissionNote = await AdmissionNotes.findOne({ mrn });

    if (!admissionNote) {
      admissionNote = new AdmissionNotes({
        patientId,
        patientName,
        mrn,
        dob,
        age,
        phone,
        email,
        gender,
        admittedOn,
        vitals: [],
        labTests: [],
        medications: [],
        observations: [],
        clinicId,
      });
    }

    // 🧠 Helper: Add only unique items by `dateTime`
    const addUniqueItems = (existingArray, newItems, key) => {
      newItems.forEach((item) => {
        const exists = existingArray.some(
          (existing) =>
            new Date(existing[key]).toISOString() ===
            new Date(item[key]).toISOString()
        );
        if (!exists) existingArray.push(item);
      });
    };

    if (vitals) addUniqueItems(admissionNote.vitals, vitals, "dateTime");
    if (labTests) addUniqueItems(admissionNote.labTests, labTests, "dateTime");
    if (medications) addUniqueItems(admissionNote.medications, medications, "dateTime");
    if (observations) addUniqueItems(admissionNote.observations, observations, "dateTime");

    await admissionNote.save();

    return res.status(200).json({
      success: true,
      message: "Admission note updated successfully.",
      data: admissionNote,
    });
  } catch (error) {
    console.error("Error updating admission notes:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


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

const getAdmittedPatientByMRN = async (req, res) => {
    try {
        const { mrn } = req.query;
        const clinicId = req.user.id; // Ensuring scope to the logged-in user's clinic

        if (!mrn) {
            return res
                .status(400)
                .json({ message: "MRN is required for search" });
        }

        // Find patients based on MRN
        const admittedPatients = await PatientAdmit.find({
            "patientDetails.mrn": mrn,
            clinicId,
        }).sort({ createdAt: -1 });

        if (admittedPatients.length === 0) {
            return res
                .status(404)
                .json({ message: "No admitted patient found with this MRN" });
        }

        res.status(200).json({
            totalRecords: admittedPatients.length,
            admittedPatients,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const searchLabTests = async (req, res) => {
  try {
    const { Labtest } = req.query; // The search input from the frontend
    const clinicId = req.user.id; // Current clinic's ID (from auth middleware)

    if (!Labtest) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    // Perform a case-insensitive regex search on groupName
    const matchingTests = await Group.find({
      clinicId,
      groupName: { $regex: Labtest, $options: "i" },
    }).select("groupName -_id"); // return only groupName, omit _id

    const result = matchingTests.map(test => test.groupName);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error searching lab tests:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const searchDrugs = async (req, res) => {
  try {
    const { Drug } = req.query;
    const clinicId = req.user.id; // Assuming JWT sets the user as the clinic

    if (!Drug) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    // Search for matching drugs in the current clinic
    const matchingDrugs = await Drug.find({
      clinicId,
      name: { $regex: Drug, $options: "i" }
    }).select("name molecule manufacturer packing weight measurement -_id");

    return res.status(200).json({ success: true, data: matchingDrugs });
  } catch (error) {
    console.error("Error searching drugs:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export {addDetailsToAdmissionNotes,allAdmittedPatients,getAdmittedPatientByMRN,searchLabTests,searchDrugs}
