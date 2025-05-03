import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStockEntries, deleteStockEntry } from "../../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StockEntry() {
    const navigate = useNavigate();

    // State variables
    const [stockEntries, setStockEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({
      supplier: '',
      status: '',
      invoiceDate: ''
    });

    // Fetch stock entries from API
    useEffect(() => {
      fetchStockEntries();
    }, []);

    const fetchStockEntries = async () => {
      try {
        setLoading(true);
        const response = await getAllStockEntries();
        console.log("API Response:", response);

        // The response is already the data array, not wrapped in a data property
        if (response) {
          setStockEntries(response);
        } else {
          setStockEntries([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching stock entries:", err);
        setError("Failed to load stock entries. Please try again.");
        toast.error("Failed to load stock entries");
        setStockEntries([]);
      } finally {
        setLoading(false);
      }
    };

    // Handle navigation to add stock entry page
    const handleAddStockEntry = () => {
      navigate("/inventory/add-stock-entry");
    };

    // Handle navigation to edit stock entry page
    const handleEditStockEntry = (id) => {
      navigate(`/inventory/edit-stock-entry/${id}`);
    };

    // Handle navigation to view stock entry page
    const handleViewStockEntry = (id) => {
      navigate(`/inventory/view-stock-entry/${id}`);
    };

    // Handle stock entry deletion
    const handleDeleteStockEntry = async (id) => {
      if (window.confirm("Are you sure you want to delete this stock entry?")) {
        try {
          setLoading(true);
          const response = await deleteStockEntry(id);
          console.log("Stock entry deleted response:", response);
          toast.success(response.message || "Stock entry deleted successfully");
          // Refresh the stock entry list
          fetchStockEntries();
        } catch (err) {
          console.error("Error deleting stock entry:", err);
          toast.error("Failed to delete stock entry");
        } finally {
          setLoading(false);
        }
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

    // Get unique values for filters
    const getUniqueValues = (key) => {
      if (key === 'supplier') {
        return [...new Set(stockEntries.map(item => item.supplier?.name).filter(Boolean))];
      }
      return [...new Set(stockEntries.map(item => item[key]).filter(Boolean))];
    };

    // Handle filter change
    const handleFilterChange = (key, value) => {
      setFilters({
        ...filters,
        [key]: value
      });
    };

    // Handle search
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };

    // Filter data based on search term and filters
    const filteredData = stockEntries.filter(item => {
      // Search term filter
      const matchesSearch = searchTerm === '' ||
        (item.invoiceNumber && item.invoiceNumber.toString().includes(searchTerm)) ||
        (item.supplier?.name && item.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(searchTerm.toLowerCase()));

      // Other filters
      const matchesSupplier = filters.supplier === '' || item.supplier?.name === filters.supplier;
      const matchesStatus = filters.status === '' || item.status === filters.status;
      const matchesInvoiceDate = filters.invoiceDate === '' ||
        (item.invoiceDate && formatDate(item.invoiceDate).includes(filters.invoiceDate));

      return matchesSearch && matchesSupplier && matchesStatus && matchesInvoiceDate;
    });
  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Stock Entry</h1>
        <div className="flex gap-4">
          <button
            className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
            onClick={handleAddStockEntry}
          >
            Add Stock Entry
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        )}

        {/* Error message */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p>{error}</p>
            <button
              onClick={fetchStockEntries}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search stock entries..."
                  className="w-full p-2.5 pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute right-3 top-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>

              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  <span>Filter</span>
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Supplier</h3>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filters.supplier}
                        onChange={(e) => handleFilterChange('supplier', e.target.value)}
                      >
                        <option value="">All Suppliers</option>
                        {getUniqueValues('supplier').map((supplier, index) => (
                          <option key={index} value={supplier}>{supplier}</option>
                        ))}
                      </select>
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        {getUniqueValues('status').map((status, index) => (
                          <option key={index} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div className="p-3 border-t border-gray-200 flex justify-end">
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        onClick={() => setFilters({
                          supplier: '',
                          status: '',
                          invoiceDate: ''
                        })}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {filteredData.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm mb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Supplier
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Invoice Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Total Items
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Total Value (₹)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.invoiceNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.supplier?.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{formatDate(item.invoiceDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{formatDate(item.dueDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.totalItems || item.itemDetails?.length || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">₹{item.totalValue || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm px-2 py-1 rounded-full text-center ${
                              item.status === 'Verified'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              className="text-blue-600 hover:text-blue-800 mr-3"
                              onClick={() => handleViewStockEntry(item._id)}
                            >
                              View
                            </button>
                            <button
                              className="text-green-600 hover:text-green-800 mr-3"
                              onClick={() => handleEditStockEntry(item._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteStockEntry(item._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-blue-50 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-700 mb-2">No stock entries found</h2>
                <p className="text-gray-500">Try adjusting your search criteria or add a new stock entry</p>
                <button
                  onClick={handleAddStockEntry}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add New Stock Entry
                </button>
              </div>
            )}

            {/* Results count */}
            {filteredData.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {filteredData.length} stock {filteredData.length !== 1 ? 'entries' : 'entry'}
                </div>
              </div>
            )}
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
  )
}