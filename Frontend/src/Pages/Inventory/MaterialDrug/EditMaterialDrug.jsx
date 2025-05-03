import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDrugById, updateDrug } from "../../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditMaterialDrug() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    molecule: '',
    manufacturer: '',
    category: '',
    schedule: '',
    hsn: '',
    packing: '',
    weight: '',
    measurement: '',
    gst: '',
    mrp: ''
  });

  // Fetch drug data on component mount
  useEffect(() => {
    fetchDrugData();
  }, [id]);

  const fetchDrugData = async () => {
    try {
      setLoading(true);
      const response = await getDrugById(id);
      console.log("Drug data response:", response);

      // The response is the drug object directly, not wrapped in a drug property
      if (response) {
        setFormData({
          name: response.name || '',
          molecule: response.molecule || '',
          manufacturer: response.manufacturer || '',
          category: response.category || '',
          schedule: response.schedule || '',
          hsn: response.hsn || '',
          packing: response.packing || '',
          weight: response.weight || '',
          measurement: response.measurement || '',
          gst: response.gst || '',
          mrp: response.mrp || ''
        });
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching drug:", err);
      setError("Failed to load drug data. Please try again.");
      toast.error("Failed to load drug data");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.name || !formData.manufacturer || !formData.category) {
        toast.error("Name, manufacturer, and category are required");
        setLoading(false);
        return;
      }

      // Prepare data for API
      const drugData = {
        name: formData.name.trim(),
        molecule: formData.molecule.trim(),
        manufacturer: formData.manufacturer.trim(),
        category: formData.category.trim(),
        schedule: formData.schedule.trim(),
        hsn: formData.hsn.trim(),
        packing: formData.packing.trim(),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        measurement: formData.measurement.trim(),
        gst: formData.gst ? parseFloat(formData.gst) : undefined,
        mrp: formData.mrp ? parseFloat(formData.mrp) : undefined
      };

      // Update drug
      const response = await updateDrug(id, drugData);
      console.log("Drug updated response:", response);
      toast.success(response.message || "Drug updated successfully!");

      // Navigate back to drug list
      setTimeout(() => {
        navigate("/inventory/material-drug");
      }, 2000);

    } catch (err) {
      console.error("Error updating drug:", err);
      toast.error(err.message || "Failed to update drug");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/inventory/material-drug");
  };

  return (
    <div className="w-full h-full flex bg-white flex-col overflow-auto">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Edit Material/Drug</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className='cursor-pointer bg-[#F0F2F5] px-4 py-1 text-sm rounded-lg'
          >
            Cancel
          </button>
          <button
            type="submit"
            form="drugForm"
            className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p>{error}</p>
            <button
              onClick={fetchDrugData}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <form id="drugForm" onSubmit={handleSubmit}>
            {/* General Info Section */}
            <div className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-sm font-semibold text-gray-500 mb-4">GENERAL INFO</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Molecule/API</label>
                  <input
                    type="text"
                    name="molecule"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.molecule}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Regulatory & Classification Section */}
            <div className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-sm font-semibold text-gray-500 mb-4">REGULATORY & CLASSIFICATION</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                  <input
                    type="text"
                    name="schedule"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.schedule}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                  <input
                    type="text"
                    name="hsn"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.hsn}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Packaging & Measurement Section */}
            <div className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-sm font-semibold text-gray-500 mb-4">PACKAGING & MEASUREMENT</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Packing</label>
                  <input
                    type="text"
                    name="packing"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.packing}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight/Volume</label>
                  <input
                    type="number"
                    name="weight"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.weight}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit measurement</label>
                  <input
                    type="text"
                    name="measurement"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.measurement}
                    onChange={handleChange}
                    placeholder="gm, ml, etc."
                  />
                </div>
              </div>
            </div>

            {/* Financial & Taxation Section */}
            <div className="mb-6 p-4 bg-white rounded shadow">
              <h2 className="text-sm font-semibold text-gray-500 mb-4">FINANCIAL & TAXATION</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST%</label>
                  <input
                    type="number"
                    name="gst"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.gst}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    name="mrp"
                    className="w-full p-2 border rounded border-gray-300"
                    value={formData.mrp}
                    onChange={handleChange}
                    step="0.01"
                  />
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