import express from "express";
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
import { addOrUpdateTestParameter, allTestParameters, editTestParameter, getTestParameter } from "../../../controllers/lab/test_parameter_master/testParameter.controller.js";

const testParameterRouter = express.Router() 

testParameterRouter.post("/add-testParameter", authenticateUser,authorizeRoles(),addOrUpdateTestParameter)
testParameterRouter.get("/get-testParameter/:id",authenticateUser, authorizeRoles(),getTestParameter)
testParameterRouter.get("/all-testParameter",authenticateUser,authorizeRoles(),allTestParameters)
testParameterRouter.put("/edit-testParameter/:id",authenticateUser,authorizeRoles(),editTestParameter)


export default testParameterRouter