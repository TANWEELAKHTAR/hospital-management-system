import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDrugs, deleteDrug } from "../../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MaterialDrug() {
    const navigate = useNavigate();

    // State variables
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({
      manufacturer: '',
      category: '',
      schedule: '',
      packing: ''
    });

    // Fetch drugs from API
    useEffect(() => {
      fetchDrugs();
    }, []);

    const fetchDrugs = async () => {
      try {
        setLoading(true);
        const response = await getAllDrugs();
        console.log("API Response:", response);

        // The response is already the data array, not wrapped in a data property
        if (response) {
          setDrugs(response);
        } else {
          setDrugs([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching drugs:", err);
        setError("Failed to load drugs. Please try again.");
        toast.error("Failed to load drugs");
        setDrugs([]);
      } finally {
        setLoading(false);
      }
    };

    // Handle navigation to add drug page
    const handleAddDrug = () => {
      navigate("/inventory/add-material-drug");
    };

    // Handle navigation to edit drug page
    const handleEditDrug = (id) => {
      navigate(`/inventory/edit-material-drug/${id}`);
    };

    // Handle navigation to view drug page
    const handleViewDrug = (id) => {
      navigate(`/inventory/view-material-drug/${id}`);
    };

    // Handle drug deletion
    const handleDeleteDrug = async (id) => {
      if (window.confirm("Are you sure you want to delete this drug?")) {
        try {
          setLoading(true);
          const response = await deleteDrug(id);
          console.log("Drug deleted response:", response);
          toast.success(response.message || "Drug deleted successfully");
          // Refresh the drug list
          fetchDrugs();
        } catch (err) {
          console.error("Error deleting drug:", err);
          toast.error("Failed to delete drug");
        } finally {
          setLoading(false);
        }
      }
    };

    // Get unique values for filters
    const getUniqueValues = (key) => {
      return [...new Set(drugs.map(item => item[key]).filter(Boolean))];
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
    const filteredData = drugs.filter(item => {
      // Search term filter
      const matchesSearch = searchTerm === '' ||
        Object.values(item).some(val =>
          val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Other filters
      const matchesManufacturer = filters.manufacturer === '' || item.manufacturer === filters.manufacturer;
      const matchesCategory = filters.category === '' || item.category === filters.category;
      const matchesSchedule = filters.schedule === '' || item.schedule === filters.schedule;
      const matchesPacking = filters.packing === '' || item.packing === filters.packing;

      return matchesSearch && matchesManufacturer && matchesCategory && matchesSchedule && matchesPacking;
    });
  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Material/Drug Management</h1>
        <div className="flex gap-4">
          <button
            className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
            onClick={handleAddDrug}
          >
            Add Material/Drug
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
              onClick={fetchDrugs}
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
                  placeholder="Search drugs..."
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
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Manufacturer</h3>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filters.manufacturer}
                        onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                      >
                        <option value="">All Manufacturers</option>
                        {getUniqueValues('manufacturer').map((manufacturer, index) => (
                          <option key={index} value={manufacturer}>{manufacturer}</option>
                        ))}
                      </select>
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {getUniqueValues('category').map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule</h3>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filters.schedule}
                        onChange={(e) => handleFilterChange('schedule', e.target.value)}
                      >
                        <option value="">All Schedules</option>
                        {getUniqueValues('schedule').map((schedule, index) => (
                          <option key={index} value={schedule}>{schedule}</option>
                        ))}
                      </select>
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Packing</h3>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={filters.packing}
                        onChange={(e) => handleFilterChange('packing', e.target.value)}
                      >
                        <option value="">All Packings</option>
                        {getUniqueValues('packing').map((packing, index) => (
                          <option key={index} value={packing}>{packing}</option>
                        ))}
                      </select>
                    </div>
                    <div className="p-3 border-t border-gray-200 flex justify-end">
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        onClick={() => setFilters({
                          manufacturer: '',
                          category: '',
                          schedule: '',
                          packing: ''
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
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Manufacturer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          HSN Code
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Packing
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Weight
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          GST
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          MRP
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
                            <div className="text-sm text-gray-600">{item.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.manufacturer}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.schedule}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.hsn}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.packing}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.weight} {item.measurement}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{item.gst}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">₹{item.mrp}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              className="text-blue-600 hover:text-blue-800 mr-3"
                              onClick={() => handleViewDrug(item._id)}
                            >
                              View
                            </button>
                            <button
                              className="text-green-600 hover:text-green-800 mr-3"
                              onClick={() => handleEditDrug(item._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteDrug(item._id)}
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
                <h2 className="text-xl font-medium text-gray-700 mb-2">No drugs found</h2>
                <p className="text-gray-500">Try adjusting your search criteria or add a new drug</p>
                <button
                  onClick={handleAddDrug}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add New Drug
                </button>
              </div>
            )}

            {/* Results count */}
            {filteredData.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {filteredData.length} drug{filteredData.length !== 1 ? 's' : ''}
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