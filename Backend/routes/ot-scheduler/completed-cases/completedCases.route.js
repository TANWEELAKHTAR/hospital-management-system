import express from "express"

import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
import { getCompletedCases, getCompletedCasesByDate, getCompletedCasesById } from "../../../controllers/ot-scheduler/completed-cases/completedCases.controller.js";

const completedCasesRouter = express.Router();

completedCasesRouter.get("/all-completed-cases", authenticateUser, getCompletedCases);
completedCasesRouter.get("/get-completed-case/:id", authenticateUser, getCompletedCasesById);

//This is an extra api, just in case if needed
completedCasesRouter.get("/get-completed-case-by-date/:date", authenticateUser, getCompletedCasesByDate);

export default completedCasesRouter