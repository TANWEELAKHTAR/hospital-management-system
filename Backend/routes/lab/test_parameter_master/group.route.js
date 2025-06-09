import express from "express";
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
import { addGroup, allGroups, editGroup, filterTestParameters, getGroupById } from "../../../controllers/lab/test_parameter_master/group.controller.js";

const groupRouter = express.Router();

groupRouter.post("/add-group",authenticateUser,authorizeRoles(),addGroup)
groupRouter.get("/get-group/:id",authenticateUser,authorizeRoles(),getGroupById)
groupRouter.get("/all-groups",authenticateUser,authorizeRoles(),allGroups)
groupRouter.get("/test-parameters",authenticateUser,authorizeRoles(),filterTestParameters)
groupRouter.put("/edit-parameter/:id",authenticateUser,authorizeRoles(),editGroup)

export default groupRouter