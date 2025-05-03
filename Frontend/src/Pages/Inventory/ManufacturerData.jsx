import { useState, useEffect } from "react";
import { getAllManufacturers, addManufacturer, updateManufacturer } from "../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManufacturerData() {
    const [searchTerm, setSearchTerm] = useState('');
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedState, setSelectedState] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentManufacturerId, setCurrentManufacturerId] = useState(null);
    const [formData, setFormData] = useState({
      brandName: '',
      address: '',
      city: '',
      state: '',
      pinCode: ''
    });

    // Fetch manufacturers on component mount
    useEffect(() => {
      fetchManufacturers();
    }, []);

    // Fetch all manufacturers from API
    const fetchManufacturers = async () => {
      try {
        setLoading(true);
        const response = await getAllManufacturers();

        // Check if response exists and has data property
        if (response && response.data) {
          setManufacturers(response.data);
          setError(null);
        } else {
          // If API returns a response but no data, use an empty array
          setManufacturers([]);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching manufacturers:", err);
        setError("Failed to load manufacturers. Please try again.");
        toast.error("Failed to load manufacturers");

        // Fallback to empty array on error
        setManufacturers([]);
      } finally {
        setLoading(false);
      }
    };

    // Extract unique states from manufacturer addresses
    const states = ['All', ...new Set(manufacturers.map(manufacturer =>
      manufacturer.state || 'Unknown'
    ).filter(state => state !== ''))];

    // Filter manufacturers based on search term and state
    const filteredManufacturers = manufacturers.filter(manufacturer => {
      const matchesSearch =
        (manufacturer.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manufacturer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manufacturer.city?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesState = selectedState === 'All' || manufacturer.state === selectedState;

      return matchesSearch && matchesState;
    });

    // Handle edit manufacturer
    const handleEdit = (manufacturer) => {
      setIsEditMode(true);
      setCurrentManufacturerId(manufacturer._id);
      setFormData({
        brandName: manufacturer.brandName || '',
        address: manufacturer.address || '',
        city: manufacturer.city || '',
        state: manufacturer.state || '',
        pinCode: manufacturer.pinCode || ''
      });
      setShowModal(true);
    };

    // Handle form input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };

    // Handle form submission (create or update)
    const handleSubmit = async () => {
      // Define manufacturerData outside the try block so it's accessible in the catch block
      let manufacturerData = {};

      try {
        setLoading(true);

        // Validate required fields
        if (!formData.brandName || !formData.address) {
          toast.error("Brand name and address are required");
          setLoading(false);
          return;
        }

        // Create a clean copy of the form data to send to the API
        manufacturerData = {
          brandName: formData.brandName.trim(),
          address: formData.address.trim(),
          city: formData.city?.trim() || '',
          state: formData.state || '',
          pinCode: formData.pinCode?.trim() || ''
        };

        console.log('Sending manufacturer data:', manufacturerData);

        if (isEditMode) {
          // Update existing manufacturer
          const response = await updateManufacturer(currentManufacturerId, manufacturerData);
          console.log('Update response:', response);
          toast.success("Manufacturer updated successfully!");

          // Update the manufacturers list
          setManufacturers(prevManufacturers =>
            prevManufacturers.map(m =>
              m._id === currentManufacturerId ? response.data : m
            )
          );
        } else {
          // Create new manufacturer
          const response = await addManufacturer(manufacturerData);
          console.log('Add response:', response);
          toast.success("Manufacturer added successfully!");

          // Add the new manufacturer to the list
          setManufacturers(prevManufacturers => [...prevManufacturers, response.data]);
        }

        // Reset form and close modal
        resetFormAndCloseModal();
      } catch (err) {
        console.error("Error saving manufacturer:", err);
        console.error("Error details:", err.response?.data || err.message);

        // Display more detailed error message
        const errorMessage = err.response?.data?.message || err.message || "Failed to save manufacturer";
        toast.error(errorMessage);

        // Log the data that was being sent
        console.log("Data being sent:", manufacturerData);
      } finally {
        setLoading(false);
      }
    };

    // Reset form and close modal
    const resetFormAndCloseModal = () => {
      setFormData({
        brandName: '',
        address: '',
        city: '',
        state: '',
        pinCode: ''
      });
      setIsEditMode(false);
      setCurrentManufacturerId(null);
      setShowModal(false);
    };

    return (
      <div className="w-full h-full flex bg-white flex-col">
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
          <h1 className="text-lg font-bold">Manufacturer Data</h1>
          <div className="flex gap-4">
            <button
              className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
              onClick={() => {
                setIsEditMode(false);
                setFormData({
                  brandName: '',
                  address: '',
                  city: '',
                  state: '',
                  pinCode: ''
                });
                setCurrentManufacturerId(null);
                setShowModal(true);
              }}
            >
              Add Manufacturer
            </button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Manufacturers Directory</h1>

          {/* Search and filter bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search manufacturers or addresses..."
                className="w-fit p-2.5 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-3">
                <SearchIcon />
              </div>
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FilterIcon />
                <span>Filter</span>
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-700 mb-2">States</h3>
                    {states.map(state => (
                      <div
                        key={state}
                        className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${selectedState === state ? 'bg-blue-50 text-blue-600' : ''}`}
                        onClick={() => {
                          setSelectedState(state);
                          setIsFilterOpen(false);
                        }}
                      >
                        {state}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

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
                onClick={fetchManufacturers}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Manufacturer table */}
          {!loading && !error && filteredManufacturers.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Brand Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        City
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        State
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredManufacturers.map(manufacturer => (
                      <tr key={manufacturer._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-800">{manufacturer.brandName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{manufacturer.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{manufacturer.city}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{manufacturer.state}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleEdit(manufacturer)}
                            className="text-teal-600 hover:text-teal-800"
                          >
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : !loading && !error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-blue-50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-700 mb-2">No manufacturers found</h2>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : null}

          {/* Results count and filter indicator */}
          {!loading && !error && filteredManufacturers.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {filteredManufacturers.length} manufacturer{filteredManufacturers.length !== 1 ? 's' : ''}
              </div>
              {selectedState !== 'All' && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Filtered by:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg flex items-center">
                    {selectedState}
                    <button
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={() => setSelectedState('All')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Manufacturer Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium flex items-center">
                  <span className="text-teal-500 mr-2">{isEditMode ? '✎' : '+'}</span>
                  {isEditMode ? 'Edit' : 'Add'} Manufacturer
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={resetFormAndCloseModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    placeholder="Enter"
                    value={formData.brandName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">Select</option>
                      <option value="TG">TG</option>
                      <option value="RJ">RJ</option>
                      <option value="MP">MP</option>
                      <option value="UP">UP</option>
                      <option value="MH">MH</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pin code
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      placeholder="Enter"
                      value={formData.pinCode}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex justify-start mt-6 space-x-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md ${loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                  >
                    {loading ? 'Processing...' : isEditMode ? 'Update' : 'Add'}
                  </button>
                  <button
                    onClick={resetFormAndCloseModal}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);