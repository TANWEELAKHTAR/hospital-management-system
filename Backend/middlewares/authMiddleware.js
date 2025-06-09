import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization"); // Get token from request headers

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = {
            id: decoded.id, // This will be either user._id (Clinic) or user.clinicId (ClinicUser)
            role: decoded.role || "clinicAdmin",
            name : decoded.name,
            dept : decoded.dept
        };

        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access Forbidden. Insufficient permissions.",
            });
        }
        next();
    };
};
