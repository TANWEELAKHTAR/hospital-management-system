import AdmissionNotes from "../../../models/doctor/Ip_dashboard/ipDashboard.model.js";
import Group from "../../../models/lab/test_parameter_master/group.model";
// import TestReport from "../../../models/lab/lab_orders/testResultEntry.model";
import TestResult from "../../../models/lab/lab_orders/testResultEntry.model.js";

const getReviewPendingLabTestsWithFilters = async (req, res) => {
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
                    (lab) => lab.status === "Review Pending"
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

const getReviewPendingLabTestsByMrn = async (req, res) => {
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
            (lab) => lab.status === "Review Pending"
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

const getTestResultsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        const testResults = await TestResult.findOne({ patientId }).populate({
            path: "reports.testId",
            populate: {
                path: "parameters",
                model: "TestParameter",
            },
        });
        // .populate('clinicId', 'name')
        // .populate('patientId', 'name');

        if (!testResults) {
            return res.status(404).json({
                success: false,
                message: "No test results found for this patient.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "all test results of patient are fetched",
            data: testResults,
        });
    } catch (error) {
        console.error("Error fetching test results:", error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
const markAllLabTestsAsCompleted = async (req, res) => {
    try {
        const admission = await AdmissionNotes.findOne({ patientId,clinicId });

            if (admission) {
                let updated = false;

                admission.labTests.forEach((labTest) => {
                    if (
                        labTest.test.toString() === testId &&
                        labTest.status === "Review Pending"
                    ) {
                        labTest.status = "Result Received";
                        updated = true;
                    }
                });

                if (updated) {
                    await admission.save();
                }
            }
            return res
                .status(201)
                .json({ success: true, message: "status changed" });
        } 
     catch (error) {
        console.error("Error updating:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
export {
    getReviewPendingLabTestsWithFilters,
    getReviewPendingLabTestsByMrn,
    getTestResultsByPatient,
};
