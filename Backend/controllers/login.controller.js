import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Clinic from "../models/superAdmin/clinic.model.js";
import ClinicUser from "../models/clinicAdmin/userManagement/clinicUser.model.js";
import Doctor from "../models/clinicAdmin/masterDataConfig/doctor/doctor.model.js";

const generateToken = (id, role, name, dept) => {
    return jwt.sign({ id, role, name, dept }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const login = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        let user = await Clinic.findOne({ clinicName: name, email });
        let tokenPayload = null;
        let userRole = "clinicAdmin"; // Default role for Clinic
        let userName = "";
        let userDept = "";
        if (!user) {
            user = await ClinicUser.findOne({ userName: name, email });
            if (user) {
                tokenPayload = user.clinicId; // Use clinicId for ClinicUser
                userRole = user.role || "clinicUser"; // Assign role, defaulting to clinicUser
                userName = user.firstName;
                userDept = user.department;
            }
        }

        if(!user){
            user = await Doctor.findOne({ name: name, email });
            if (user) {
                tokenPayload = user.clinicId; // Use clinicId for Doctor
                userRole = user.role || "doctor"; // Assign role, defaulting to doctor
                userName = user.name;
                userDept = user.department;
            }
        }
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate token with (id, role)
        const token = generateToken(tokenPayload || user._id, userRole, userName, userDept);

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export default login;
