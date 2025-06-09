import StockEntry from "../../../models/inventory/stockEntry/stockEntry.model.js";
import xlsx from "xlsx";
import axios from "axios";
import Supplier from "../../../models/inventory/supplier_data/supplier.model.js";
import InvoiceNumber from "../../../models/superAdmin/invoiceNumber.model.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);

export const handleStockMigration = async (req, res) => {
  try {
    const file = req.file;
    const fileURL = file.path;

    console.log("File uploaded to Cloudinary:", fileURL);

    // Download file from Cloudinary
    const response = await axios.get(fileURL, { responseType: "arraybuffer" });

    let parsedData = [];

    if (fileURL.endsWith(".csv")) {
      const csvStr = response.data.toString("utf8");
      const rows = csvStr.split("\n");
      const headers = rows[0].split(",");

      parsedData = rows.slice(1).filter(Boolean).map((row) => {
        const values = row.split(",");
        return headers.reduce((obj, key, index) => {
          obj[key.trim()] = values[index]?.trim();
          return obj;
        }, {});
      });
    } else if (fileURL.endsWith(".xlsx")) {
      const workbook = xlsx.read(response.data, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      parsedData = xlsx.utils.sheet_to_json(sheet);
    }

    // Now process each row as a separate StockEntry document
    const stockEntries = [];

    /*
     This is a normalization code not implemented now. Just for testing purposes

    // Define normalization map: known variations for each key
    const normalizeMap = {
    supplier: ["supplier", "Supplier ID", "SupplierId"],
    invoiceNumber: ["invoice number", "InvoiceNumber", "invoice_no", "invoiceNo"],
    invoiceDate: ["invoice date", "InvoiceDate"],
    dueDate: ["due date", "DueDate"],
    clinicId: ["clinicId", "Clinic ID"],
    status: ["status", "Status"],
    drug: ["drug", "Drug Name"],
    batchNumber: ["batchNumber", "Batch No", "batch_no"],
    expiryDate: ["expiry date", "ExpiryDate"],
    mrp: ["mrp", "MRP"],
    ptr: ["ptr", "PTR"],
    quantity: ["quantity", "Qty"],
    freeQuantity: ["free quantity", "Free Qty", "freeQty"],
    disc: ["disc", "Discount"],
    amount: ["amount", "Total Amount", "Amount"],
    };

    // Helper to get standardized key
    const normalizeKeys = (row) => {
    const normalizedRow = {};

    for (const [standardKey, aliases] of Object.entries(normalizeMap)) {
        for (const alias of aliases) {
        const foundKey = Object.keys(row).find(
            (key) => key.trim().toLowerCase() === alias.trim().toLowerCase()
        );
        if (foundKey) {
            normalizedRow[standardKey] = row[foundKey];
            break;
        }
        }
    }

    return normalizedRow;
    };

    */
    const parseExcelOrStringDate = (rawDate) => {
        if (typeof rawDate === "number") {
          // Excel serial number to JS Date
          return new Date(Math.round((rawDate - 25569) * 86400 * 1000));
        }
      
        const cleaned = (rawDate || "").toString().trim().replace(/\s+/g, " ");
      
        const formats = [
          "DD-MM-YYYY HH:mm:ss",
          "DD/MM/YYYY HH:mm:ss",
          "YYYY-MM-DD HH:mm:ss",
          "MM-DD-YYYY HH:mm:ss",
          "DD-MM-YYYY",
          "DD/MM/YYYY",
          "YYYY-MM-DD",
        ];
      
        const parsed = dayjs(cleaned, formats, true);
        return parsed.isValid() ? parsed.toDate() : null;
      };
    for (const row of parsedData) {
    //   const row = normalizeKey(rawRow);
    const {
        materialName,
        batch,
        dosageForm,
        qoh,
        stockUnit,
        purchaseRate,
        mrp,
        landedCost,
        supplier,
        expiryDate,
        receivedDate,
      } = row;
      
      const expDate = parseExcelOrStringDate(expiryDate);
      const invoiceDate = parseExcelOrStringDate(receivedDate);
      
      if (!expDate || !invoiceDate) {
        console.warn("⚠️ Invalid date format found in row:", row);
        return;
      }
      
      const itemDetail = {
        drug: materialName,
        batchNumber: batch,
        expiryDate: expDate,
        mrp: parseFloat(mrp),
        ptr: parseFloat(purchaseRate),
        quantity: parseInt(qoh),
        freeQuantity: 0,
        disc: 0,
        amount: parseFloat(landedCost),
      };
      
      const supplierDetails = await Supplier.findOne({
        name: supplier,
        clinicId: req.user.id,
      });
      
      if (!supplierDetails) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      
      const dueDays = parseInt(supplierDetails.dueDate.split(" ")[0], 10);
      if (isNaN(dueDays)) {
        return res.status(400).json({ message: "Invalid due date format in supplier" });
      }
      
      const dueDate = dayjs(invoiceDate).add(dueDays, "day").toDate();
      
      // 🧾 Fetch invoice number
      const invoiceNumber = await InvoiceNumber.findOne({
        clinicId: req.user.id,
      });
      
      // 📦 Create StockEntry
      const stockEntry = new StockEntry({
        supplier: supplierDetails._id,
        invoiceNumber: invoiceNumber.invoiceNumber,
        invoiceDate,
        dueDate,
        itemDetails: [itemDetail],
        status: "Verified",
        clinicId: req.user.id,
        totalItems: 1,
        totalValue: itemDetail.amount,
        totalGST: 0, // optional
      });
      
      stockEntries.push(stockEntry);
    }    

    // Save all entries in bulk
    await StockEntry.insertMany(stockEntries);

    return res.status(200).json({
      message: "Stock entries migrated and saved successfully!",
      totalSaved: stockEntries.length,
      samplePreview: stockEntries.slice(0, 3),
    });
  } catch (err) {
    console.error("Stock Migration Error:", err);
    return res.status(500).json({
      message: "Stock migration failed",
      error: err.message,
    });
  }
};

export const showPreview = async (req, res) => {
    try {
        const file = req.file;
        const fileURL = file.path;
    
        console.log("File uploaded to Cloudinary:", fileURL);
    
        // Download file from Cloudinary
        const response = await axios.get(fileURL, { responseType: "arraybuffer" });
    
        let parsedData = [];
    
        if (fileURL.endsWith(".csv")) {
          const csvStr = response.data.toString("utf8");
          const rows = csvStr.split("\n");
          const headers = rows[0].split(",");
    
          parsedData = rows.slice(1).filter(Boolean).map((row) => {
            const values = row.split(",");
            return headers.reduce((obj, key, index) => {
              obj[key.trim()] = values[index]?.trim();
              return obj;
            }, {});
          });
        } else if (fileURL.endsWith(".xlsx")) {
          const workbook = xlsx.read(response.data, { type: "buffer" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          parsedData = xlsx.utils.sheet_to_json(sheet);
        }
    
        // Now process each row as a separate StockEntry document
        const stockEntries = [];
    
        /*
         This is a normalization code not implemented now. Just for testing purposes
    
        // Define normalization map: known variations for each key
        const normalizeMap = {
        supplier: ["supplier", "Supplier ID", "SupplierId"],
        invoiceNumber: ["invoice number", "InvoiceNumber", "invoice_no", "invoiceNo"],
        invoiceDate: ["invoice date", "InvoiceDate"],
        dueDate: ["due date", "DueDate"],
        clinicId: ["clinicId", "Clinic ID"],
        status: ["status", "Status"],
        drug: ["drug", "Drug Name"],
        batchNumber: ["batchNumber", "Batch No", "batch_no"],
        expiryDate: ["expiry date", "ExpiryDate"],
        mrp: ["mrp", "MRP"],
        ptr: ["ptr", "PTR"],
        quantity: ["quantity", "Qty"],
        freeQuantity: ["free quantity", "Free Qty", "freeQty"],
        disc: ["disc", "Discount"],
        amount: ["amount", "Total Amount", "Amount"],
        };
    
        // Helper to get standardized key
        const normalizeKeys = (row) => {
        const normalizedRow = {};
    
        for (const [standardKey, aliases] of Object.entries(normalizeMap)) {
            for (const alias of aliases) {
            const foundKey = Object.keys(row).find(
                (key) => key.trim().toLowerCase() === alias.trim().toLowerCase()
            );
            if (foundKey) {
                normalizedRow[standardKey] = row[foundKey];
                break;
            }
            }
        }
    
        return normalizedRow;
        };
    
        */
        const parseExcelOrStringDate = (rawDate) => {
            if (typeof rawDate === "number") {
              // Excel serial number to JS Date
              return new Date(Math.round((rawDate - 25569) * 86400 * 1000));
            }
          
            const cleaned = (rawDate || "").toString().trim().replace(/\s+/g, " ");
          
            const formats = [
              "DD-MM-YYYY HH:mm:ss",
              "DD/MM/YYYY HH:mm:ss",
              "YYYY-MM-DD HH:mm:ss",
              "MM-DD-YYYY HH:mm:ss",
              "DD-MM-YYYY",
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ];
          
            const parsed = dayjs(cleaned, formats, true);
            return parsed.isValid() ? parsed.toDate() : null;
          };
        for (const row of parsedData) {
        //   const row = normalizeKey(rawRow);
        const {
            materialName,
            batch,
            dosageForm,
            qoh,
            stockUnit,
            purchaseRate,
            mrp,
            landedCost,
            supplier,
            expiryDate,
            receivedDate,
          } = row;
          
          const expDate = parseExcelOrStringDate(expiryDate);
          const invoiceDate = parseExcelOrStringDate(receivedDate);
          
          if (!expDate || !invoiceDate) {
            console.warn("Invalid date format found in row:", row);
            return;
          }
          
          const itemDetail = {
            drug: materialName,
            batchNumber: batch,
            expiryDate: expDate,
            mrp: parseFloat(mrp),
            ptr: parseFloat(purchaseRate),
            quantity: parseInt(qoh),
            freeQuantity: 0,
            disc: 0,
            amount: parseFloat(landedCost),
          };
          
          const supplierDetails = await Supplier.findOne({
            name: supplier,
            clinicId: req.user.id,
          });
          
          if (!supplierDetails) {
            return res.status(404).json({ message: "Supplier not found" });
          }
          
          const dueDays = parseInt(supplierDetails.dueDate.split(" ")[0], 10);
          if (isNaN(dueDays)) {
            return res.status(400).json({ message: "Invalid due date format in supplier" });
          }
          
          const dueDate = dayjs(invoiceDate).add(dueDays, "day").toDate();
          
          const invoiceNumber = await InvoiceNumber.findOne({
            clinicId: req.user.id,
          });
          
          const stockEntry = new StockEntry({
            supplier: supplierDetails._id,
            invoiceNumber: invoiceNumber.invoiceNumber,
            invoiceDate,
            dueDate,
            itemDetails: [itemDetail],
            status: "Verified",
            clinicId: req.user.id,
            totalItems: 1,
            totalValue: itemDetail.amount,
            totalGST: 0, // optional
          });
          
          stockEntries.push(stockEntry);
        }    
    
        return res.status(200).json({
          message: "Stock entries preview",
          samplePreview: stockEntries.slice(0, 10),
        });
      } catch (err) {
        console.error("Stock Preview Error:", err);
        return res.status(500).json({
          message: "Stock preview failed",
          error: err.message,
        });
      }
};