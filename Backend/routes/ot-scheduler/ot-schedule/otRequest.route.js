import express from "express"

import {authenticateUser} from "../../../middlewares/authMiddleware.js"
import { addOtRequest, findAvailableOTs, getOtRequests, getOtRequestsDoctorwise, getPatients, scheduleOT, searchUser } from "../../../controllers/ot-scheduler/ot-schedule/otRequest.controller.js";

const otRequestRouter = express.Router();

//-----These apis are for doctor module----------
//The first api is for fetching all the names to choose from the dropdown
otRequestRouter.get("/get-patients", authenticateUser, getPatients); 
otRequestRouter.post("/add-ot-request", authenticateUser, addOtRequest);

//This api will be used only in doctor module to see the OT requests done by the currently logged in doctor
otRequestRouter.get("/all-current-doctor-requests", authenticateUser, getOtRequestsDoctorwise);

//----These apis are for OT scheduler module---------
otRequestRouter.get("/all-ot-requests",authenticateUser, getOtRequests);

//There is no seperate getRequestById api, the following api returns that along with the OTs
otRequestRouter.get("/get-available-ots/:requestId", authenticateUser, findAvailableOTs);

//This search api takes both name and role to make it easier for frontend
//to run the same search across all of the options such as
//scrub nurse, surgical assistant, circulating nurse etc
otRequestRouter.get("/search-user", authenticateUser, searchUser);

otRequestRouter.post("/schedule-ot", authenticateUser, scheduleOT);


export default otRequestRouter