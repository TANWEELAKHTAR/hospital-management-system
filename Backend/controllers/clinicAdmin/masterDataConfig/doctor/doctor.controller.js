import Doctor from "../../../../models/clinicAdmin/masterDataConfig/doctor/doctor.model.js";
import bcrypt from "bcrypt";  

const generateRandomPassword = () => {
    const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit number
    return `ClinicUser${randomNumbers}`;
}; 

const addDoctor = async (req, res) => {
    try {
        const {
            name,
            registrationNumber,
            qualification,
            email,
            department,
            timing,
            consultationFee,
            registrationFee,
            emergencyFee,
            validityDays,
            validityVisits,
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !registrationNumber ||
            !qualification ||
            !email ||
            !department ||
            !timing?.days?.length ||
            !timing?.inTime ||
            !timing?.outTime ||
            !consultationFee ||
            !registrationFee ||
            !emergencyFee ||
            !validityDays ||
            !validityVisits
        ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const rawPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // Check if doctor with same email already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: "Doctor with this email already exists" });
        }

        // Validate clinic ID from user session
        const clinicId = req.user.id;
        if (!clinicId) {
            return res.status(403).json({ success: false, message: "Unauthorized: Clinic ID not found in user data." });
        }

        // Create and save new doctor
        const newDoctor = new Doctor({
            name,
            registrationNumber,
            qualification,
            email,
            department,
            timing, // Includes { days: ["Monday", "Tuesday"], inTime: "09:00", outTime: "17:00" }
            consultationFee,
            registrationFee,
            emergencyFee,
            validityDays,
            validityVisits,
            password : hashedPassword,
            clinicId,
        });

        await newDoctor.save();

        return res.status(201).json({
            success: true,
            message: "Doctor added successfully",
            doctor: newDoctor,
            rawPassword,
        });
    } catch (error) {
        console.error("Error adding doctor:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


const editDoctor = async (req, res) => {
    try {
        const { id } = req.params; // Extract doctor ID from params
        const {
            name,
            registrationNumber,
            qualification,
            email,
            department,
            timing,
            consultationFee,
            registrationFee,
            emergencyFee,
            validityDays,
            validityVisits,
        } = req.body;

        // Validate MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid doctor ID format" });
        }

        // Find the doctor by ID
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Prepare update fields
        const update = {};
        if (name) update.name = name;
        if (registrationNumber) update.registrationNumber = registrationNumber;
        if (qualification) update.qualification = qualification;

        if (email) {
            // Check if email is already taken by another doctor
            const existingDoctor = await Doctor.findOne({ email });
            if (existingDoctor && existingDoctor.id !== id) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            update.email = email;
        }

        if (department) update.department = department;
        
        // Update timing structure correctly
        if (timing?.days?.length) update["timing.days"] = timing.days;
        if (timing?.inTime) update["timing.inTime"] = timing.inTime;
        if (timing?.outTime) update["timing.outTime"] = timing.outTime;

        if (consultationFee !== undefined) update.consultationFee = consultationFee;
        if (registrationFee !== undefined) update.registrationFee = registrationFee;
        if (emergencyFee !== undefined) update.emergencyFee = emergencyFee;
        if (validityDays !== undefined) update.validityDays = validityDays;
        if (validityVisits !== undefined) update.validityVisits = validityVisits;

        // Update doctor in the database
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });

        return res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            doctor: updatedDoctor,
        });
    } catch (error) {
        console.error("Error updating doctor:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


const allDoctors = async (req, res) => {
    try {
        const {
            department,
            qualification,
            registrationNumber,
            email,
            name,
            sortBy,
            order,
            page,
            limit,
        } = req.query;

        const filter = { clinicId: req.user.id };

        // Apply filters if present
        if (department) filter.department = department;
        if (qualification) filter.qualification = qualification;
        if (registrationNumber) filter.registrationNumber = registrationNumber;
        if (email) filter.email = email;
        if (name) filter.name = { $regex: name, $options: "i" }; // Case-insensitive search

        // Sorting options
        const sortField = sortBy || "createdAt"; // Default sort by createdAt
        const sortOrder = order === "asc" ? 1 : -1; // Default descending order

        // Pagination
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        // Fetch doctors from the database
        const doctors = await Doctor.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(pageSize);

        // Get total count for pagination info
        const totalDoctors = await Doctor.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Doctors retrieved successfully",
            data: doctors,
            pagination: {
                totalDoctors,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(totalDoctors / pageSize),
            },
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
const getDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "id is required" });
        }
        const doctor = await Doctor.findOne({ _id: id });
        if (!doctor) {
            return res
                .status(404)
                .json({ success: false, message: "no doctor exist at this id" });
        }
        return res
            .status(200)
            .json({ success: true, message: "doctor found", doctor });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
};

export { addDoctor, editDoctor, allDoctors,getDoctor };
