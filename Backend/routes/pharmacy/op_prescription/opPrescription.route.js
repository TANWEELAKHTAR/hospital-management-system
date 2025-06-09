import express from "express"

import { generateFinalBill, getStockOptions, previewPrescription, searchPatient } from "../../../controllers/pharmacy/op_prescription/opPrescription.controller.js";
import { authenticateUser } from "../../../middlewares/authMiddleware.js";

const opPrescriptionRouter = express.Router();

opPrescriptionRouter.get("/get-prescription/:mrn", authenticateUser, previewPrescription);
opPrescriptionRouter.get("/stock-options", authenticateUser, getStockOptions);
opPrescriptionRouter.post("/generate-bill", authenticateUser, generateFinalBill);
opPrescriptionRouter.get("/search-patient", authenticateUser, searchPatient);

export default opPrescriptionRouter;
