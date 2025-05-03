import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization"); // Get token from request headers

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        // For development purposes, allow a special bypass token
        // This is a more permissive check that will work with any token containing 'mock-token'
        if (token.includes('mock-token')) {
            console.log('Using development bypass for authentication');

            // Set a default user for development
            req.user = {
                id: '123456789012345678901234', // Mock MongoDB ObjectId
                role: 'clinicAdmin',
            };

            return next();
        }

        // Normal JWT verification for production
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || 'your-secret-key');

        req.user = {
            id: decoded.id, // This will be either user._id (Clinic) or user.clinicId (ClinicUser)
            role: decoded.role || "clinicAdmin",
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        console.error('Token that caused error:', token);
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // If no roles are specified, allow access to any authenticated user
        if (allowedRoles.length === 0) {
            return next();
        }

        // Otherwise, check if the user has one of the allowed roles
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access Forbidden. Insufficient permissions.",
            });
        }
        next();
    };
};
