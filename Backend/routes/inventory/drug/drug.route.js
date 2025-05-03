import express from "express";
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
import { createDrug, getAllDrugs, getDrugById, updateDrug, deleteDrug } from "../../../controllers/inventory/drug/drug.controller.js";
const drugRouter = express.Router();

// Use authorizeRoles() with no parameters to allow any authenticated user
drugRouter.post("/add-drug", authenticateUser, authorizeRoles(), createDrug);
drugRouter.get("/all-drugs", authenticateUser, authorizeRoles(), getAllDrugs);
drugRouter.get("/get-drug/:id", authenticateUser, authorizeRoles(), getDrugById);
drugRouter.put("/edit-drug/:id", authenticateUser, authorizeRoles(), updateDrug);
drugRouter.delete("/delete-drug/:id", authenticateUser, authorizeRoles(), deleteDrug);

export default drugRouter;