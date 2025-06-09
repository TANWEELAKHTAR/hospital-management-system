import Patient from "../../../models/reception/new_patient_reg/newPatient.model.js";
import Bed from "../../../models/clinicAdmin/masterDataConfig/bed/bed.model.js";
import PatientAdmit from "../../../models/reception/patient_master/patientAdmit.model.js";
import Doctor from "../../../models/clinicAdmin/masterDataConfig/doctor/doctor.model.js";

const searchBeds = async (req, res) => {
    try {
        const { wardName } = req.body; // Get ward name from query parameter
        const clinicId = req.user.id;
        if (!wardName) {
            return res.status(400).json({ message: "Ward name is required" });
        }

        // Find all patient admissions with the given ward name
        const beds = await Bed.find({ wardName, clinicId });

        if (beds.length === 0) {
            return res
                .status(404)
                .json({ message: "No beds found in the given ward" });
        }

        res.status(200).json({ success: "true", beds });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const admitPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { date, time, doctor, reasonForAdmit, bed } = req.body;

        // Find the patient by ID
        const existingPatient = await Patient.findById(patientId);

        if (!existingPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const clinicId = req.user.id;
        const alreadyAdmitted = await PatientAdmit.findOne({
            patientId,
            clinicId,
        });

        if (alreadyAdmitted) {
            return res.status(400).json({
                message: "Patient is already admitted",
                admission: alreadyAdmitted,
            });
        }

        const existingDoctor = await Doctor.findOne({ name: doctor, clinicId });
        if (!existingDoctor) {
            return res
                .status(400)
                .json({ message: "Doctor not found in the system" });
        }

        const existingBed = await Bed.findOne({
            wardName: bed.ward,
            roomNumber: bed.roomNumber,
            bedNumber: bed.bedNumber,
            clinicId,
        });
        if (!existingBed) {
            return res
                .status(400)
                .json({
                    message:
                        "Provided bed does not exist in the given ward and room type",
                });
        }

        // Generate a unique 8-digit IP number (stored as a Number)
        //  const generateRandomIpNumber = async () => {
        //     let ipNumber;
        //     let isUnique = false;

        //     while (!isUnique) {
        //         ipNumber = Math.floor(10000000 + Math.random() * 90000000); // Generates an 8-digit number
        //         const existingIp = await PatientAdmit.findOne({ ipNumber });
        //         if (!existingIp) {
        //             isUnique = true;
        //         }
        //     }
        //     return ipNumber;
        // };

        // const ipNumber = await generateRandomIpNumber(); // Ensure uniqueness

        // Create patient admission record
        const newAdmission = new PatientAdmit({
            patientId: existingPatient._id, // Reference to Patient model
            patientDetails: {
                mrn: existingPatient.mrn,
                name: existingPatient.givenName,
                age: existingPatient.age,
                gender: existingPatient.gender,
                contact: existingPatient.phone,
                address: existingPatient.address,
            },
            date,
            time,
            doctor,
            reasonForAdmit,
            bed,
            clinicId,
            // ipNumber,
        });

        await newAdmission.save();

        res.status(201).json({
            message: "Patient admitted successfully",
            admission: newAdmission,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
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

const dischargePatient = async (req, res) => {
    try {
        const { admissionId } = req.params;
        const clinicId = req.user.id; // Ensuring scope to the logged-in user's clinic

        // Find admission record
        const admissionRecord = await PatientAdmit.findOne({
            _id: admissionId,
            clinicId,
        });

        if (!admissionRecord) {
            return res
                .status(404)
                .json({
                    message: "Admission record not found or unauthorized",
                });
        }

        // Remove the admission record (discharge the patient)
        await PatientAdmit.findByIdAndDelete(admissionId);

        res.status(200).json({
            message: `Patient ${admissionRecord.patientDetails.name} (MRN: ${admissionRecord.patientDetails.mrn}) has been successfully discharged.`,
            dischargedPatient: admissionRecord,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export {
    admitPatient,
    searchBeds,
    allAdmittedPatients,
    dischargePatient,
    getAdmittedPatientByMRN,
};
