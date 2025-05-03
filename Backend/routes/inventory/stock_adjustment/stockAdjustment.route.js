import express from "express"
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js"
import { addStockAdjustment, getStockAdjustments, searchStock } from "../../../controllers/inventory/stock_adjustment/stockAdjustment.controller.js"

const stockAdjustmentRouter = express.Router()

// For development, we'll make these routes accessible without authentication
// In production, you would want to add the authenticateUser middleware back
stockAdjustmentRouter.get("/search-stock", searchStock);
stockAdjustmentRouter.post("/add-stock-adjustment", addStockAdjustment);
stockAdjustmentRouter.get("/get-stock-adjustments", getStockAdjustments);

export default stockAdjustmentRouter