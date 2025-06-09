import express from "express";
import { createUnregisteredPatientBill,getDrugsByUnregisteredPatientBillId,editDrugInUnregisteredPatientBill,deleteDrugFromUnregisteredPatientBill } from "../../../controllers/pharmacy/unregistered_patients/unregisteredPatients.controller.js";
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
const unregisteredPatientRouter = express.Router();

unregisteredPatientRouter.post("/create-bill",authenticateUser,createUnregisteredPatientBill)
unregisteredPatientRouter.put("/edit-bill/:billId/drug/:drugId",authenticateUser,editDrugInUnregisteredPatientBill)
unregisteredPatientRouter.get("/:billId/drugs",authenticateUser,getDrugsByUnregisteredPatientBillId)
unregisteredPatientRouter.delete("/:billId/delete-drug/:drugId",authenticateUser,deleteDrugFromUnregisteredPatientBill)
export default unregisteredPatientRouter;