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
    console.log("Received stock migration request");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const file = req.file;
    if (!file) {
      console.error("No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File details:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    });

    const fileURL = file.path;
    console.log("File uploaded to Cloudinary:", fileURL);

    try {
      // Download file from Cloudinary
      console.log("Downloading file from Cloudinary...");
      const response = await axios.get(fileURL, {
        responseType: "arraybuffer",
        timeout: 30000 // 30 seconds timeout
      });
      console.log("File downloaded, size:", response.data.length);

      let parsedData = [];

      // Determine file type from original filename
      const isCSV = file.originalname.toLowerCase().endsWith('.csv') || fileURL.toLowerCase().endsWith('.csv');
      const isXLSX = file.originalname.toLowerCase().endsWith('.xlsx') || fileURL.toLowerCase().endsWith('.xlsx');

      console.log("File type:", isCSV ? "CSV" : isXLSX ? "XLSX" : "Unknown");

      if (isCSV) {
        console.log("Parsing CSV file...");
        const csvStr = response.data.toString("utf8");
        const rows = csvStr.split("\n");

        if (rows.length === 0) {
          return res.status(400).json({ message: "Empty CSV file" });
        }

        const headers = rows[0].split(",");
        console.log("CSV headers:", headers);

        parsedData = rows.slice(1).filter(Boolean).map((row) => {
          const values = row.split(",");
          return headers.reduce((obj, key, index) => {
            obj[key.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });
      } else if (isXLSX) {
        console.log("Parsing XLSX file...");
        const workbook = xlsx.read(response.data, { type: "buffer" });
        const sheetNames = workbook.SheetNames;

        if (sheetNames.length === 0) {
          return res.status(400).json({ message: "No sheets found in XLSX file" });
        }

        console.log("XLSX sheets:", sheetNames);
        const sheet = workbook.Sheets[sheetNames[0]];
        parsedData = xlsx.utils.sheet_to_json(sheet);
      } else {
        return res.status(400).json({
          message: "Unsupported file format. Please upload a CSV or XLSX file.",
          fileType: file.mimetype,
          fileName: file.originalname
        });
      }

      console.log(`Parsed ${parsedData.length} rows from file`);
      console.log("Sample data:", parsedData.slice(0, 2));

      if (parsedData.length === 0) {
        return res.status(400).json({ message: "No data found in file" });
      }

      // Now process each row as a separate StockEntry document
      const stockEntries = [];
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

      // For development, use a hardcoded clinic ID if not available
      const clinicId = req.user?.id || '123456789012345678901234';

      // Mock supplier for development
      const mockSupplier = {
        _id: "123456789012345678901234",
        name: "Mock Supplier",
        dueDate: "30 days"
      };

      // Mock invoice number for development
      const mockInvoiceNumber = {
        invoiceNumber: "INV-" + Math.floor(Math.random() * 10000)
      };

      let successCount = 0;
      let errorCount = 0;

      for (const row of parsedData) {
        try {
          // Extract data from row, handling different possible field names
          const materialName = row.materialName || row.drug || row.item || row.name;
          const batch = row.batch || row.batchNumber || row.batch_no;
          const qoh = row.qoh || row.quantity || row.qty || row.stock;
          const purchaseRate = row.purchaseRate || row.ptr || row.purchase_rate || row.cost;
          const mrpValue = row.mrp || row.price || row.selling_price;
          const landedCost = row.landedCost || row.total || row.amount || (qoh * purchaseRate);
          const expiryDateValue = row.expiryDate || row.expiry || row.expiry_date;
          const receivedDateValue = row.receivedDate || row.received_date || row.date;

          if (!materialName || !batch) {
            console.warn("Missing required fields in row:", row);
            errorCount++;
            continue;
          }

          const expDate = parseExcelOrStringDate(expiryDateValue) || new Date(new Date().setFullYear(new Date().getFullYear() + 1));
          const invoiceDate = parseExcelOrStringDate(receivedDateValue) || new Date();

          const itemDetail = {
            drug: materialName,
            batchNumber: batch,
            expiryDate: expDate,
            mrp: parseFloat(mrpValue || 0),
            ptr: parseFloat(purchaseRate || 0),
            quantity: parseInt(qoh || 0),
            freeQuantity: 0,
            disc: 0,
            amount: parseFloat(landedCost || 0),
          };

          // In a real implementation, we would look up the supplier
          // For development, we'll use a mock supplier
          const supplierDetails = mockSupplier;
          const dueDays = 30;
          const dueDate = dayjs(invoiceDate).add(dueDays, "day").toDate();
          const invoiceNumber = mockInvoiceNumber;

          // Create StockEntry
          const stockEntry = new StockEntry({
            supplier: supplierDetails._id,
            invoiceNumber: invoiceNumber.invoiceNumber,
            invoiceDate,
            dueDate,
            itemDetails: [itemDetail],
            status: "Verified",
            clinicId,
            totalItems: 1,
            totalValue: itemDetail.amount,
            totalGST: 0,
          });

          stockEntries.push(stockEntry);
          successCount++;
        } catch (rowError) {
          console.error("Error processing row:", rowError);
          errorCount++;
          // Continue with next row
        }
      }

      if (stockEntries.length === 0) {
        return res.status(400).json({
          message: "No valid data found in the file. Please check the format.",
          requiredColumns: "materialName/drug/item, batch/batchNumber, qoh/quantity, mrp/price, purchaseRate/ptr, expiryDate/expiry"
        });
      }

      try {
        // Save all entries in bulk
        const savedEntries = await StockEntry.insertMany(stockEntries);
        console.log(`Saved ${savedEntries.length} stock entries`);

        return res.status(200).json({
          message: "Stock entries migrated and saved successfully!",
          totalSaved: savedEntries.length,
          totalErrors: errorCount,
          samplePreview: savedEntries.slice(0, 3).map(entry => entry.toObject()),
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({
          message: "Failed to save stock entries to database",
          error: dbError.message,
          stack: dbError.stack
        });
      }
    } catch (downloadError) {
      console.error("Error downloading or parsing file:", downloadError);
      return res.status(500).json({
        message: "Failed to download or parse file",
        error: downloadError.message,
        stack: downloadError.stack
      });
    }
  } catch (err) {
    console.error("Stock Migration Error:", err);
    return res.status(500).json({
      message: "Stock migration failed",
      error: err.message,
      stack: err.stack
    });
  }
};

export const showPreview = async (req, res) => {
    try {
        console.log("Received preview request");
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        const file = req.file;
        if (!file) {
            console.error("No file in request");
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log("File details:", {
            fieldname: file.fieldname,
            originalname: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path
        });

        const fileURL = file.path;
        console.log("File uploaded to Cloudinary:", fileURL);

        try {
            // Download file from Cloudinary
            console.log("Downloading file from Cloudinary...");
            const response = await axios.get(fileURL, {
                responseType: "arraybuffer",
                timeout: 30000 // 30 seconds timeout
            });
            console.log("File downloaded, size:", response.data.length);

            let parsedData = [];

            // Determine file type from original filename
            const isCSV = file.originalname.toLowerCase().endsWith('.csv') || fileURL.toLowerCase().endsWith('.csv');
            const isXLSX = file.originalname.toLowerCase().endsWith('.xlsx') || fileURL.toLowerCase().endsWith('.xlsx');

            console.log("File type:", isCSV ? "CSV" : isXLSX ? "XLSX" : "Unknown");

            if (isCSV) {
                console.log("Parsing CSV file...");
                const csvStr = response.data.toString("utf8");
                const rows = csvStr.split("\n");

                if (rows.length === 0) {
                    return res.status(400).json({ message: "Empty CSV file" });
                }

                const headers = rows[0].split(",");
                console.log("CSV headers:", headers);

                parsedData = rows.slice(1).filter(Boolean).map((row) => {
                    const values = row.split(",");
                    return headers.reduce((obj, key, index) => {
                        obj[key.trim()] = values[index]?.trim();
                        return obj;
                    }, {});
                });
            } else if (isXLSX) {
                console.log("Parsing XLSX file...");
                const workbook = xlsx.read(response.data, { type: "buffer" });
                const sheetNames = workbook.SheetNames;

                if (sheetNames.length === 0) {
                    return res.status(400).json({ message: "No sheets found in XLSX file" });
                }

                console.log("XLSX sheets:", sheetNames);
                const sheet = workbook.Sheets[sheetNames[0]];
                parsedData = xlsx.utils.sheet_to_json(sheet);
            } else {
                return res.status(400).json({
                    message: "Unsupported file format. Please upload a CSV or XLSX file.",
                    fileType: file.mimetype,
                    fileName: file.originalname
                });
            }

            console.log(`Parsed ${parsedData.length} rows from file`);
            console.log("Sample data:", parsedData.slice(0, 2));

            if (parsedData.length === 0) {
                return res.status(400).json({ message: "No data found in file" });
            }

            // For simplicity in preview, just return the raw parsed data
            // This avoids potential errors in data transformation
            return res.status(200).json({
                message: "File parsed successfully",
                totalItems: parsedData.length,
                samplePreview: parsedData.slice(0, 10),
            });

        } catch (downloadError) {
            console.error("Error downloading or parsing file:", downloadError);
            return res.status(500).json({
                message: "Failed to download or parse file",
                error: downloadError.message
            });
        }
    } catch (err) {
        console.error("Stock Preview Error:", err);
        return res.status(500).json({
            message: "Stock preview failed",
            error: err.message,
            stack: err.stack
        });
    }
};