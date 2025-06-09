import express from "express";
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
import { createDrug, getAllDrugs,getDrugById, updateDrug, deleteDrug } from "../../../controllers/inventory/drug/drug.controller.js";
const drugRouter = express.Router();

drugRouter.post("/add-drug", authenticateUser, createDrug);
drugRouter.get("/all-drugs", authenticateUser, getAllDrugs);
drugRouter.get("/get-drug/:id", authenticateUser, getDrugById);
drugRouter.put("/edit-drug/:id", authenticateUser, updateDrug);
drugRouter.delete("/delete-drug/:id", authenticateUser, deleteDrug);

export default drugRouter;