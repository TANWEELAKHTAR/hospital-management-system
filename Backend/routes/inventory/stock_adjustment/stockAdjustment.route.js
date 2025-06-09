import express from "express"
import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js"
import { addStockAdjustment, getStockAdjustments, searchStock } from "../../../controllers/inventory/stock_adjustment/stockAdjustment.controller.js"


const stockAdjustmentRouter = express.Router()

stockAdjustmentRouter.get("/search-stock", authenticateUser, searchStock);
stockAdjustmentRouter.post("/add-stock-adjustment", authenticateUser, addStockAdjustment)
stockAdjustmentRouter.get("/get-stock-adjustments", authenticateUser, getStockAdjustments)

export default stockAdjustmentRouter