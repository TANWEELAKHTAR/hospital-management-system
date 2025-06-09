import express from "express";

import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
import { completeOtCase, getOtSchedules, updateOtSchedule } from "../../../controllers/ot-scheduler/ot-schedule/otScheduled.controller.js";

const otScheduledRouter = express.Router();

otScheduledRouter.get("/all-ot-scheduled", authenticateUser, getOtSchedules);
otScheduledRouter.put("/update-ot-schedule/:id", authenticateUser, updateOtSchedule);
otScheduledRouter.put("/complete-ot-case/:id", authenticateUser, completeOtCase);

export default otScheduledRouter;