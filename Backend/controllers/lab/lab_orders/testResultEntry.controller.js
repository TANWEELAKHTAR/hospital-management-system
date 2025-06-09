import AdmissionNotes from "../../../models/doctor/Ip_dashboard/ipDashboard.model.js";
import Group from "../../../models/lab/test_parameter_master/group.model.js";
import TestResult from "../../../models/lab/lab_orders/testResultEntry.model.js";
const getAwaitingLabTestsWithFilters = async (req, res) => {
    try {
        const {
            patientName,
            age,
            gender,
            phone,
            page = 1,
            limit = 10,
        } = req.query;
        const clinicId = req.user.id; // Assuming clinic ID comes from logged-in user

        let filter = { clinicId };

        if (patientName)
            filter.patientName = { $regex: new RegExp(patientName, "i") };
        if (age) filter.age = age;
        if (gender) filter.gender = gender;
        if (phone) filter.phone = phone;

        const total = await AdmissionNotes.countDocuments(filter);

        const notes = await AdmissionNotes.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        // Extract only 'Awaiting result' lab tests
        const awaitingLabTests = notes
            .map((note) => ({
                patientName: note.patientName,
                age: note.age,
                gender: note.gender,
                phone: note.phone,
                mrn: note.mrn,
                labTests: note.labTests.filter(
                    (lab) => lab.status === "Awaiting result"
                ),
            }))
            .filter((entry) => entry.labTests.length > 0);

        res.status(200).json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: awaitingLabTests,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getAwaitingLabTestsByMrn = async (req, res) => {
    try {
        const { mrn } = req.params;
        const clinicId = req.user.id;
        const admissionNote = await AdmissionNotes.findOne({ mrn, clinicId });

        if (!admissionNote) {
            return res
                .status(404)
                .json({ message: "No patient found with given MRN" });
        }

        const awaitingLabTests = admissionNote.labTests.filter(
            (lab) => lab.status === "Awaiting result"
        );

        res.status(200).json({
            patientName: admissionNote.patientName,
            mrn: admissionNote.mrn,
            labTests: awaitingLabTests,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const fetchPatientLabTestGroups = async (patientId) => {
    try {
        // Step 1: Get the patient's AdmissionNotes and extract test names
        const admission = await AdmissionNotes.findOne({ patientId });

        if (!admission || admission.labTests.length === 0) {
            return []; // No tests found
        }

        // Extract test names from labTests array
        const testNames = admission.labTests.map((test) => test.test);

        // Step 2: Find Group documents matching those test names
        const groups = await Group.find({ groupName: { $in: testNames } })
            .populate({
                path: "parameters",
                model: "TestParameter",
            })
            .exec();

        return res.status(200).json({success:"true", groups:groups});
    } catch (err) {
        console.error("Error fetching lab test groups:", err);
        throw err;
    }
};
const addTestReport = async (req, res) => {
    try {
        // Get patientId from route params
        const { patientId } = req.params;

        // Get testId and results from body
        const { testId, results } = req.body;

        // Validation
        if (!testId || !results) {
            return res.status(400).json({
                success: false,
                message: "Missing testId or results.",
            });
        }

        // Check if a report exists for the patient
        const clinicId = req.user.id;
        let report = await TestResult.findOne({ patientId, clinicId });

        const newTest = {
            testId,
            results,
        };

        if (report) {
            report.reports.push(newTest);
            await report.save();
            return res.status(200).json({
                success: true,
                message: "Test added to existing report.",
                report,
            });
        } else {
            const report = new TestResult({
                patientId,
                clinicId,
                reports: [newTest],
            });
            await report.save();

            // ✅ Update lab test status only if it is currently "Awaiting result"
            const admission = await AdmissionNotes.findOne({ patientId,clinicId });

            if (admission) {
                let updated = false;

                admission.labTests.forEach((labTest) => {
                    if (
                        labTest.test.toString() === testId &&
                        labTest.status === "Awaiting result"
                    ) {
                        labTest.status = "Review Pending";
                        updated = true;
                    }
                });

                if (updated) {
                    await admission.save();
                }
            }
            return res
                .status(201)
                .json({ success: true, message: "New test report created.",report });
        }
    } catch (error) {
        console.error("Error adding test report:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
export {
    getAwaitingLabTestsByMrn,
    getAwaitingLabTestsWithFilters,
    fetchPatientLabTestGroups,
    addTestReport,
};
