import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllSuppliers, addSupplier, updateSupplier } from "../../api/inventoryService";

export default function SupplierDistributorData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSupplierId, setCurrentSupplierId] = useState(null);

  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    gstNumber: '',
    regionType: 'Local',
    phoneNumber: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    dueDateForBill: '45 days after bill date'
  });

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch all suppliers from API
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await getAllSuppliers();
      console.log("Suppliers response:", response);

      // Check if response exists and has data property
      if (response && response.data) {
        setSuppliers(response.data);
        setError(null);
      } else {
        // If API returns a response but no data, use an empty array
        setSuppliers([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to load suppliers. Please try again.");
      toast.error("Failed to load suppliers");

      // Fallback to empty array on error
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier => {
    return (
      supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phoneNumber?.toString().includes(searchTerm)
    );
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle radio button changes
  const handleRadioChange = (value) => {
    setFormData(prevData => ({
      ...prevData,
      regionType: value
    }));
  };

  // Reset form and close modal
  const resetFormAndCloseModal = () => {
    setFormData({
      name: '',
      gstNumber: '',
      regionType: 'Local',
      phoneNumber: '',
      address: '',
      city: '',
      state: 'Maharashtra',
      pinCode: '',
      dueDateForBill: '45 days after bill date'
    });
    setIsEditMode(false);
    setCurrentSupplierId(null);
    setShowModal(false);
  };

  // Handle edit supplier
  const handleEdit = (supplier) => {
    setIsEditMode(true);
    setCurrentSupplierId(supplier._id);
    setFormData({
      name: supplier.name || '',
      gstNumber: supplier.gstNumber || '',
      regionType: supplier.regionType || 'Local',
      phoneNumber: supplier.phoneNumber || '',
      address: supplier.address || '',
      city: supplier.city || '',
      state: supplier.state || 'Maharashtra',
      pinCode: supplier.pinCode || '',
      dueDateForBill: supplier.dueDate || '45 days after bill date'
    });
    setShowModal(true);
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    // Define supplierData outside the try block so it's accessible in the catch block
    let supplierData = {};

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.name || !formData.gstNumber || !formData.phoneNumber) {
        toast.error("Name, GST number, and phone number are required");
        setLoading(false);
        return;
      }

      // Prepare data for API - ensure all fields are properly formatted
      supplierData = {
        name: formData.name.trim(),
        gstNumber: formData.gstNumber.trim(),
        regionType: formData.regionType,
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address?.trim() || '',
        city: formData.city?.trim() || '',
        state: formData.state || '',
        pinCode: formData.pinCode?.trim() || '',
        // Send dueDateForBill as is - the backend will handle it
        dueDateForBill: formData.dueDateForBill
      };

      console.log('Sending supplier data:', supplierData);

      if (isEditMode) {
        // Update existing supplier
        const response = await updateSupplier(currentSupplierId, supplierData);
        console.log('Update response:', response);
        toast.success("Supplier updated successfully!");

        // Update the suppliers list with the returned data
        if (response && response.data) {
          setSuppliers(prevSuppliers =>
            prevSuppliers.map(s =>
              s._id === currentSupplierId ? response.data : s
            )
          );
        }

        // Refresh the suppliers list to ensure we have the latest data
        fetchSuppliers();
      } else {
        // Create new supplier
        const response = await addSupplier(supplierData);
        console.log('Add response:', response);
        toast.success("Supplier added successfully!");

        // Add the new supplier to the list if we have data
        if (response && response.data) {
          setSuppliers(prevSuppliers => [...prevSuppliers, response.data]);
        }

        // Refresh the suppliers list to ensure we have the latest data
        fetchSuppliers();
      }

      // Reset form and close modal
      resetFormAndCloseModal();
    } catch (err) {
      console.error("Error saving supplier:", err);
      console.error("Error details:", err.response?.data || err.message);

      // Display more detailed error message
      const errorMessage = err.response?.data?.message || err.message || "Failed to save supplier";
      toast.error(errorMessage);

      // Log the data that was being sent
      console.log("Data being sent:", supplierData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Supplier/Distributor Data</h1>
        <div className="flex gap-4">
          <button
            className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
            onClick={() => {
              setIsEditMode(false);
              setFormData({
                name: '',
                gstNumber: '',
                regionType: 'Local',
                phoneNumber: '',
                address: '',
                city: '',
                state: 'Maharashtra',
                pinCode: '',
                dueDateForBill: '45 days after bill date'
              });
              setCurrentSupplierId(null);
              setShowModal(true);
            }}
          >
            Add Supplier
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Suppliers Directory</h1>

        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search suppliers..."
              className="w-full p-2.5 pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
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
              onClick={fetchSuppliers}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Suppliers Table */}
        {!loading && !error && filteredSuppliers.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      GST Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Region
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Due Date for Bill
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier._id || supplier.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{supplier.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{supplier.gstNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{supplier.regionType || supplier.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{supplier.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{supplier.dueDate || supplier.dueDateForBill}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
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
            <h2 className="text-xl font-medium text-gray-700 mb-2">No suppliers found</h2>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : null}

        {/* Results count */}
        {!loading && !error && filteredSuppliers.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium flex items-center">
                <span className="text-teal-500 mr-2">{isEditMode ? '✎' : '+'}</span>
                {isEditMode ? 'Edit' : 'Add'} Supplier/Distributor
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="PharmaTech Suppliers"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="27AAAPP1234C1Z0"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="regionType"
                      checked={formData.regionType === 'Local'}
                      onChange={() => handleRadioChange('Local')}
                      className="form-radio h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">Local</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="regionType"
                      checked={formData.regionType === 'Non-Local'}
                      onChange={() => handleRadioChange('Non-Local')}
                      className="form-radio h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">Non-Local</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="09178453627"
                  value={formData.phoneNumber}
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
                  placeholder="abc street, xyz road"
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
                    placeholder="Pune"
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
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pin code
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    placeholder="111045"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due date for bill <span className="text-red-500">*</span>
                </label>
                <select
                  name="dueDateForBill"
                  value={formData.dueDateForBill}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="45 days after bill date">45 days after bill date</option>
                  <option value="1 month after bill date">1 month after bill date</option>
                  <option value="15 days after bill date">15 days after bill date</option>
                </select>
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
