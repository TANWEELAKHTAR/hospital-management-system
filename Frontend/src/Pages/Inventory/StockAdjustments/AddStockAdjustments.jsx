import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDrugs, addStockAdjustment } from "../../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddStockAdjustments() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [loadingDrugs, setLoadingDrugs] = useState(false);
  const [selectedDrugId, setSelectedDrugId] = useState("");

  // Fetch all drugs on component mount
  useEffect(() => {
    fetchDrugs();
  }, []);

  // Fetch all drugs from API
  const fetchDrugs = async () => {
    try {
      setLoadingDrugs(true);
      const data = await getAllDrugs();
      console.log("Fetched drugs:", data);
      setDrugs(data || []);
    } catch (error) {
      console.error("Error fetching drugs:", error);
      toast.error("Failed to fetch drugs");
    } finally {
      setLoadingDrugs(false);
    }
  };

  // Handle item selection
  const handleItemChange = (e) => {
    const drugId = e.target.value;
    setSelectedDrugId(drugId);

    if (!drugId) {
      setSelectedItem("");
      setBatchNumber("");
      setCurrentStock("");
      return;
    }

    // Handle test option
    if (drugId === "test") {
      setSelectedItem("Test Drug");
      setBatchNumber("BATCH-" + Math.floor(Math.random() * 10000));
      setCurrentStock(Math.floor(Math.random() * 100) + 10);
      return;
    }

    const selectedDrug = drugs.find(drug => drug._id === drugId);
    if (selectedDrug) {
      console.log("Selected drug:", selectedDrug);
      setSelectedItem(selectedDrug.name);

      // Generate a random batch number since it's not in the drug model
      const randomBatch = "BATCH-" + Math.floor(Math.random() * 10000);
      setBatchNumber(randomBatch);

      // Generate a random stock value since it's not in the drug model
      const randomStock = Math.floor(Math.random() * 100) + 10;
      setCurrentStock(randomStock);
    }
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission values:", {
      selectedItem,
      batchNumber,
      currentStock,
      adjustmentValue,
      reason
    });

    // Validate form
    if (!selectedItem) {
      toast.error("Please select an item");
      return;
    }

    if (!batchNumber) {
      toast.error("Batch number is required");
      return;
    }

    if (!currentStock && currentStock !== 0) {
      toast.error("Current stock is required");
      return;
    }

    if (!adjustmentValue) {
      toast.error("Adjustment value is required");
      return;
    }

    if (!reason) {
      toast.error("Please select a reason for adjustment");
      return;
    }

    try {
      setLoading(true);

      // Parse numeric values
      const parsedCurrentStock = parseInt(currentStock);
      const parsedAdjustmentValue = parseInt(adjustmentValue);

      // Additional validation
      if (isNaN(parsedCurrentStock)) {
        toast.error("Current stock must be a valid number");
        setLoading(false);
        return;
      }

      if (isNaN(parsedAdjustmentValue)) {
        toast.error("Adjustment value must be a valid number");
        setLoading(false);
        return;
      }

      // Check if adjustment would result in negative stock
      if (parsedCurrentStock + parsedAdjustmentValue < 0) {
        toast.error("Adjustment would result in negative stock");
        setLoading(false);
        return;
      }

      // Prepare data for API
      const adjustmentData = {
        itemName: selectedItem,
        batchNumber,
        currStock: parsedCurrentStock,
        adjustmentValue: parsedAdjustmentValue,
        reason
      };

      console.log("Final adjustment data being sent:", adjustmentData);

      console.log("Sending adjustment data:", adjustmentData);

      try {
        // Add stock adjustment
        const response = await addStockAdjustment(adjustmentData);
        console.log("Stock adjustment added:", response);

        toast.success(response.message || "Stock adjustment added successfully");

        // Navigate back to stock adjustments list
        setTimeout(() => {
          navigate("/inventory/stock-adjustments");
        }, 2000);
      } catch (apiError) {
        console.error("API Error:", apiError);
        toast.error(apiError.message || "Failed to add stock adjustment. Check the console for details.");
      }

    } catch (error) {
      console.error("Error adding stock adjustment:", error);
      toast.error(error.message || "Failed to add stock adjustment");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/inventory/stock-adjustments");
  };

  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Add Stock Adjustment</h1>
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
            {loading ? "Adding..." : "Save"}
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE] overflow-auto">
        {(loading || loadingDrugs) && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        )}

        {!loading && !loadingDrugs && (
          <form onSubmit={handleSubmit}>
            {/* Item Detail Section */}
            <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-lg font-medium text-gray-600 mb-4">ITEM DETAIL</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-500"
                      value={selectedDrugId}
                      onChange={handleItemChange}
                    >
                      <option value="">Select an item</option>
                      <option value="test">Test Drug (Demo)</option>
                      {loadingDrugs ? (
                        <option value="" disabled>Loading drugs...</option>
                      ) : (
                        drugs.map(drug => (
                          <option key={drug._id} value={drug._id}>
                            {drug.name}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {selectedItem && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="font-medium">{selectedItem}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter batch number"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current stock
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter current stock"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Adjustment Detail Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-600 mb-4">ADJUSTMENT DETAIL</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjustment value (+/-) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter adjustment value"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Use positive value to add, negative value to remove</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      <option value="">Select reason</option>
                      <option value="Damage">Damage</option>
                      <option value="Expiry">Expiry</option>
                      <option value="Physical Count">Physical Count</option>
                      <option value="Returns">Returns</option>
                      <option value="Wrong Entry">Wrong Entry</option>
                      <option value="Unbilled Consumption">Unbilled Consumption</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
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
  );
}
