import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStockEntryById } from "../../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewStockEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stockEntry, setStockEntry] = useState(null);

  // Fetch stock entry on component mount
  useEffect(() => {
    fetchStockEntry();
  }, [id]);

  // Fetch stock entry by ID
  const fetchStockEntry = async () => {
    try {
      setLoading(true);
      const response = await getStockEntryById(id);
      
      if (response) {
        setStockEntry(response);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching stock entry:", err);
      setError("Failed to load stock entry data. Please try again.");
      toast.error("Failed to load stock entry data");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate total amount
  const calculateTotal = () => {
    if (!stockEntry || !stockEntry.itemDetails) return 0;
    return stockEntry.itemDetails.reduce((sum, item) => {
      const ptr = parseFloat(item.ptr) || 0;
      const qty = parseFloat(item.quantity) || 0;
      const disc = parseFloat(item.disc) || 0;
      return sum + (ptr * qty * (1 - disc / 100));
    }, 0).toFixed(2);
  };

  // Handle back button
  const handleBack = () => {
    navigate("/inventory/stock-entry");
  };

  // Handle edit button
  const handleEdit = () => {
    navigate(`/inventory/edit-stock-entry/${id}`);
  };

  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">View Stock Entry</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleBack}
            className='cursor-pointer bg-[#F0F2F5] px-4 py-1 text-sm rounded-lg'
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
          >
            Edit
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE] overflow-auto">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p>{error}</p>
            <button
              onClick={fetchStockEntry}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && stockEntry && (
          <div>
            {/* Invoice Details Section */}
            <div className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-sm font-semibold text-gray-500 mb-4">INVOICE DETAILS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Supplier</p>
                  <p className="text-sm text-gray-900">{stockEntry.supplier?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Invoice Number</p>
                  <p className="text-sm text-gray-900">{stockEntry.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Invoice Date</p>
                  <p className="text-sm text-gray-900">{formatDate(stockEntry.invoiceDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Due Date</p>
                  <p className="text-sm text-gray-900">{formatDate(stockEntry.dueDate)}</p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                stockEntry.status === 'Verified' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {stockEntry.status}
              </span>
            </div>

            {/* Items Section */}
            <div className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-sm font-semibold text-gray-500 mb-4">ITEMS</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PTR</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Free</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disc%</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockEntry.itemDetails && stockEntry.itemDetails.map((item, index) => {
                      const amount = (parseFloat(item.ptr) * parseFloat(item.quantity) * (1 - parseFloat(item.disc || 0) / 100)).toFixed(2);
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.drug}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.batchNumber}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatDate(item.expiryDate)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">₹{item.mrp}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">₹{item.ptr}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.freeQuantity || 0}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.disc || 0}%</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">₹{amount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-sm font-semibold text-gray-500 mb-4">SUMMARY</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Items</p>
                  <p className="text-sm text-gray-900">{stockEntry.itemDetails?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Value</p>
                  <p className="text-sm text-gray-900">₹{calculateTotal()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Created At</p>
                  <p className="text-sm text-gray-900">{formatDate(stockEntry.createdAt)}</p>
                </div>
              </div>
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
  );
}
