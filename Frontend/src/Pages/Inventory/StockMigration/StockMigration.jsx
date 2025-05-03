import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addStockMigration, previewStockMigration } from "../../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StockMigration() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const csvFile = files[0];
      if (csvFile.type === "text/csv" || csvFile.name.endsWith(".csv") ||
          csvFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          csvFile.name.endsWith(".xlsx")) {
        setFile(csvFile);
      } else {
        toast.error("Please upload a CSV or XLSX file");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const csvFile = e.target.files[0];
      if (csvFile.type === "text/csv" || csvFile.name.endsWith(".csv") ||
          csvFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          csvFile.name.endsWith(".xlsx")) {
        setFile(csvFile);
      } else {
        toast.error("Please upload a CSV or XLSX file");
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const downloadTemplate = () => {
    // Create a sample CSV template
    const headers = "materialName,batch,dosageForm,qoh,stockUnit,purchaseRate,mrp,landedCost,supplier,expiryDate,receivedDate\n";
    const sampleRow = "Paracetamol,BATCH123,Tablet,100,Strips,5.5,10.0,550,Supplier Name,2024-12-31,2023-01-01\n";
    const csvContent = headers + sampleRow;

    // Create a blob and download it
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_migration_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    console.log("Starting preview with file:", file.name, "type:", file.type);

    try {
      setPreviewLoading(true);
      setShowPreview(false);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Log FormData (for debugging)
      console.log("FormData created with file:", file.name);

      // Get preview data
      console.log("Calling previewStockMigration API...");
      const response = await previewStockMigration(formData);
      console.log("Stock preview response:", response);

      if (response && response.samplePreview && response.samplePreview.length > 0) {
        console.log("Preview data received:", response.samplePreview.length, "items");
        setPreviewData(response.samplePreview);
        setShowPreview(true);
        toast.info(`Preview generated with ${response.samplePreview.length} items. Please review before processing.`);
      } else {
        console.warn("No valid preview data in response:", response);
        toast.warning("No valid data found in the file. Please check the format.");
      }

    } catch (error) {
      console.error("Error previewing stock:", error);
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response error status:", error.response.status);
        toast.error(`Server error: ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        console.error("Request error:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(`Error: ${error.message || "Failed to preview stock data"}`);
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload file
      const response = await addStockMigration(formData);
      console.log("Stock migration response:", response);

      toast.success(response.message || "Stock migration successful");

      // Navigate back to stock entry list
      setTimeout(() => {
        navigate("/inventory/stock-entry");
      }, 2000);

    } catch (error) {
      console.error("Error migrating stock:", error);
      toast.error(error.message || "Failed to migrate stock");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/inventory/stock-entry");
  };


  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Stock Migration</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer bg-[#F0F2F5] px-4 py-1 text-sm rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white"
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload & Process"}
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            <p className="ml-3 text-lg text-gray-700">Processing your file...</p>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center
                      ${isDragging ? 'border-teal-600 bg-teal-50' : 'border-teal-300'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="bg-teal-600 p-3 rounded-full mb-4 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 15V3m0 0L8 7m4-4l4 4" />
                  <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
                  <path d="M7 12.5V14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.5" />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Import Stocks</h2>

              <p className="text-gray-600 mb-2">
                Drag and drop CSV or XLSX file here or{" "}
                <button
                  className="text-teal-600 font-medium hover:text-teal-700 focus:outline-none"
                  onClick={handleUploadClick}
                >
                  browse
                </button>{" "}
                to upload your file
              </p>

              <p className="text-gray-600 mb-6">
                Don't have a template?{" "}
                <button
                  className="text-teal-600 font-medium hover:text-teal-700 focus:outline-none"
                  onClick={downloadTemplate}
                >
                  Click here to download
                </button>
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv,.xlsx"
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center">
                    <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-gray-700">{file.name}</span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md font-medium focus:outline-none"
                      onClick={handlePreview}
                      disabled={previewLoading}
                    >
                      {previewLoading ? "Generating..." : "Preview Data"}
                    </button>
                    <button
                      className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md font-medium focus:outline-none"
                      onClick={handleSubmit}
                    >
                      Process File
                    </button>
                  </div>

                  {/* Preview Section */}
                  {showPreview && previewData && previewData.length > 0 && (
                    <div className="mt-8 w-full max-w-4xl">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Data Preview (First {previewData.length} items)</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP</th>
                              <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((item, index) => {
                              // Extract data from row, handling different possible field names
                              const materialName = item.materialName || item.drug || item.item || item.name || "N/A";
                              const batch = item.batch || item.batchNumber || item.batch_no || "N/A";
                              const qoh = item.qoh || item.quantity || item.qty || item.stock || 0;
                              const mrpValue = item.mrp || item.price || item.selling_price || 0;
                              const expiryDateValue = item.expiryDate || item.expiry || item.expiry_date;

                              // Format expiry date if available
                              let formattedExpiryDate = "N/A";
                              if (expiryDateValue) {
                                try {
                                  const date = new Date(expiryDateValue);
                                  if (!isNaN(date.getTime())) {
                                    formattedExpiryDate = date.toLocaleDateString();
                                  }
                                } catch (e) {
                                  console.warn("Invalid date format:", expiryDateValue);
                                }
                              }

                              return (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                  <td className="py-2 px-4 border-b text-sm">{materialName}</td>
                                  <td className="py-2 px-4 border-b text-sm">{batch}</td>
                                  <td className="py-2 px-4 border-b text-sm">{qoh}</td>
                                  <td className="py-2 px-4 border-b text-sm">{mrpValue}</td>
                                  <td className="py-2 px-4 border-b text-sm">{formattedExpiryDate}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Note: This is just a preview. Click "Process File" to import all items.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md font-medium focus:outline-none"
                  onClick={handleUploadClick}
                >
                  Select File
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}