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

stockEntryRouter.get("/get-default-details", authenticateUser, getInvoiceDetails);
stockEntryRouter.post("/save-stock", authenticateUser, saveStock);
stockEntryRouter.post("/add-stock", authenticateUser, addStock);
stockEntryRouter.get("/get-stocks", authenticateUser, getAllStocks);
stockEntryRouter.get("/get-stock/:id", authenticateUser, getStockById);
stockEntryRouter.put("/edit-stock/:id", authenticateUser, updateStock)
stockEntryRouter.delete("/delete-stock/:id", authenticateUser, deleteStock);
stockEntryRouter.get("/search-drug", authenticateUser, searchDrug);

export default stockEntryRouter;