import express from "express";

import { authenticateUser } from "../../../../middlewares/authMiddleware.js";
import { createOtMaster, deleteOtMaster, getAllOtMasters, getOtMasterById, updateOtMaster } from "../../../../controllers/ot-scheduler/ot-setup/ot-masters/otMasters.controller.js";

const otMastersRouter = express.Router();

otMastersRouter.post("/create-ot-masters",authenticateUser, createOtMaster);
otMastersRouter.get("/get-all-ot-masters",authenticateUser, getAllOtMasters);
otMastersRouter.get("/get-ot-master/:id",authenticateUser, getOtMasterById);
otMastersRouter.put("/edit-ot-master/:id",authenticateUser, updateOtMaster);
otMastersRouter.delete("/delete-ot-master/:id",authenticateUser, deleteOtMaster);

export default otMastersRouter;