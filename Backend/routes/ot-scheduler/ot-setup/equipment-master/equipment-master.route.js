import express from "express"

import { authenticateUser } from "../../../../middlewares/authMiddleware.js";
import { createEquipment, deleteEquipment, getAllEquipments, getEquipmentById, updateEquipment } from "../../../../controllers/ot-scheduler/ot-setup/equipment-master/equipment-master.controller.js";

const equipmentMasterRouter = express.Router();

equipmentMasterRouter.post("/create-equipment",authenticateUser, createEquipment);
equipmentMasterRouter.get("/all-equipments", authenticateUser, getAllEquipments);
equipmentMasterRouter.get("/get-equipment/:id", authenticateUser, getEquipmentById);
equipmentMasterRouter.put("/edit-equipment/:id", authenticateUser, updateEquipment);
equipmentMasterRouter.delete("/delete-equipment/:id", authenticateUser, deleteEquipment);


export default equipmentMasterRouter;
