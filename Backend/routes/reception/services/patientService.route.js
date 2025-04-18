import express from "express"

import { addServiceToPatient, deleteServiceFromPatient, generateBill, getPatientByMRN, searchServices } from "../../../controllers/reception/services/patientServices.controller.js"

import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js"

const patientServiceRouter = express.Router();

patientServiceRouter.get("/get-patient/:mrn", authenticateUser, authorizeRoles("Receptionist"), getPatientByMRN)
patientServiceRouter.get("/get-service", authenticateUser, authorizeRoles("Receptionist"), searchServices)
patientServiceRouter.post("/add-service", authenticateUser, authorizeRoles("Receptionist"), addServiceToPatient)
patientServiceRouter.delete("/delete-service", authenticateUser, authorizeRoles("Receptionist"), deleteServiceFromPatient)
patientServiceRouter.get("/generate-bill", authenticateUser, authorizeRoles("Receptionist"), generateBill)

export default patientServiceRouter