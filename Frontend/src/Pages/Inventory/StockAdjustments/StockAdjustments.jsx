import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStockAdjustments } from "../../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StockAdjustments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch stock adjustments on component mount
  useEffect(() => {
    fetchStockAdjustments();
  }, []);

  // Fetch stock adjustments from API
  const fetchStockAdjustments = async () => {
    try {
      setLoading(true);
      const data = await getAllStockAdjustments();
      console.log("Fetched stock adjustments:", data);
      setAdjustments(data || []);
    } catch (error) {
      console.error("Error fetching stock adjustments:", error);
      toast.error("Failed to fetch stock adjustments");
    } finally {
      setLoading(false);
    }
  };

  // Filter icon SVG
  const FilterIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );

  // Search icon SVG
  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
  // Filter adjustments based on search query
  const filteredAdjustments = adjustments.filter(adjustment =>
    adjustment.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adjustment.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adjustment.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle navigation to add page
  const handleAddClick = () => {
    navigate("/inventory/add-stock-adjustment");
  };

  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Stock Adjustments</h1>
        <div className="flex gap-4">
          <button
            className="cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white"
            onClick={handleAddClick}
          >
            Add adjustments
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search by item name, batch number, or reason"
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <SearchIcon />
                </div>
              </div>

              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-green-100"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FilterIcon />
                Filter
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-green-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Batch No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Adjustment Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdjustments.length > 0 ? (
                    filteredAdjustments.map((adjustment) => (
                      <tr key={adjustment._id} className="hover:bg-green-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {adjustment.itemName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {adjustment.batchNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {adjustment.currStock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {adjustment.adjustmentValue > 0 ? `+ ${adjustment.adjustmentValue}` : adjustment.adjustmentValue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {adjustment.reason}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchQuery ? "No matching adjustments found" : "No stock adjustments found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
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
