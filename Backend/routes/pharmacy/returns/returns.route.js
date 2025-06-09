import express from "express"

import { searchBillsByInvoiceNumber } from "../../../controllers/pharmacy/returns/returns.controller.js";
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";

const returnsRouter = express.Router();

returnsRouter.get("/get-bills", authenticateUser, searchBillsByInvoiceNumber);
// returnsRouter.post("/generate-bill", authenticateUser, generateBill);

export default returnsRouter;