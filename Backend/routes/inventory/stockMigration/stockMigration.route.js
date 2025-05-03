import express from "express"
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";
import upload from "../../../middlewares/multer/stockMigration/multerStockMigration.js";
import { handleStockMigration, showPreview } from "../../../controllers/inventory/stockMigration/stockMigration.controller.js";

const stockMigrationRouter = express.Router()

// For development, we'll make these routes accessible without authentication
// In production, you would want to add the authenticateUser middleware back
stockMigrationRouter.post("/show-preview", upload.single("file"), showPreview);
stockMigrationRouter.post("/add-stock-migration", upload.single("file"), handleStockMigration);

export default stockMigrationRouter