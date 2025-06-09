import express from "express"
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
import upload from "../../../middlewares/multer/stockMigration/multerStockMigration.js";
import { handleStockMigration, showPreview } from "../../../controllers/inventory/stockMigration/stockMigration.controller.js";

const stockMigrationRouter = express.Router()

stockMigrationRouter.get("/show-preview", upload.single("file"), authenticateUser, showPreview);
stockMigrationRouter.post("/add-stock-migration", upload.single("file") ,authenticateUser, handleStockMigration);

export default stockMigrationRouter