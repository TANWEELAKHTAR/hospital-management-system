import express from "express";

import {
    getInvoiceDetails,
    saveStock,
    addStock,
    getAllStocks,
    getStockById,
    deleteStock,
    updateStock,
    searchDrug
} from "../../../controllers/inventory/stockEntry/stockEntry.controller.js";

import { authenticateUser, authorizeRoles } from "../../../middlewares/authMiddleware.js";

const stockEntryRouter = express.Router();

// Use authorizeRoles() with no parameters to allow any authenticated user
stockEntryRouter.get("/get-default-details", authenticateUser, authorizeRoles(), getInvoiceDetails);
stockEntryRouter.post("/save-stock", authenticateUser, authorizeRoles(), saveStock);
stockEntryRouter.post("/add-stock", authenticateUser, authorizeRoles(), addStock);
stockEntryRouter.get("/get-stocks", authenticateUser, authorizeRoles(), getAllStocks);
stockEntryRouter.get("/get-stock/:id", authenticateUser, authorizeRoles(), getStockById);
stockEntryRouter.put("/edit-stock/:id", authenticateUser, authorizeRoles(), updateStock);
stockEntryRouter.delete("/delete-stock/:id", authenticateUser, authorizeRoles(), deleteStock);
stockEntryRouter.get("/search-drug", authenticateUser, authorizeRoles(), searchDrug);

export default stockEntryRouter;