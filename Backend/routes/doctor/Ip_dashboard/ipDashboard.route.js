import express from "express";
import { authenticateUser,authorizeRoles } from "../../../middlewares/authMiddleware.js";
import {addDetailsToAdmissionNotes, allAdmittedPatients, getAdmittedPatientByMRN, searchDrugs, searchLabTests} from "../../../controllers/doctor/Ip_dashboard/ipDashboard.controller.js";
const ipDashboardRouter = express.Router();

ipDashboardRouter.post("/:patientId/add-admission-notes",authenticateUser,addDetailsToAdmissionNotes)
ipDashboardRouter.get("/all-admitted-patients",authenticateUser,allAdmittedPatients)
ipDashboardRouter.get("/get-admitted-patient",authenticateUser,getAdmittedPatientByMRN)
ipDashboardRouter.get("/search/lab-tests",authenticateUser,searchLabTests)
ipDashboardRouter.get("/search/drugs",authenticateUser,searchDrugs)

export default ipDashboardRouter