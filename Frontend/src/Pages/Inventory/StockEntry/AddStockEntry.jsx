import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addStockEntry, getInvoiceDetails, getAllSuppliers } from "../../../api/inventoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddStockEntry() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [itemRows, setItemRows] = useState([{
    drug: '',
    batchNumber: '',
    expiryDate: '',
    mrp: '',
    ptr: '',
    quantity: '',
    freeQuantity: '0',
    disc: '0',
    amount: '0'
  }]);

  const [formData, setFormData] = useState({
    supplier: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'Pending'
  });

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      const response = await getAllSuppliers();
      if (response && response.data) {
        setSuppliers(response.data);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      toast.error("Failed to load suppliers");
    }
  };

  // Handle supplier change and fetch invoice details
  const handleSupplierChange = async (e) => {
    const supplierName = e.target.value;
    setFormData(prev => ({ ...prev, supplier: supplierName }));

    if (supplierName) {
      try {
        const response = await getInvoiceDetails(supplierName, formData.invoiceDate);
        if (response) {
          setFormData(prev => ({
            ...prev,
            invoiceNumber: response.invoiceNumber || '',
            dueDate: response.dueDate ? new Date(response.dueDate).toISOString().split('T')[0] : ''
          }));
        }
      } catch (err) {
        console.error("Error fetching invoice details:", err);
      }
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle item row changes
  const handleItemChange = (index, field, value) => {
    const newRows = [...itemRows];
    newRows[index][field] = value;

    // Calculate amount if price and quantity are available
    if (field === 'ptr' || field === 'quantity' || field === 'disc') {
      const ptr = parseFloat(newRows[index].ptr) || 0;
      const qty = parseFloat(newRows[index].quantity) || 0;
      const disc = parseFloat(newRows[index].disc) || 0;

      // Calculate amount with discount
      const amount = ptr * qty * (1 - disc / 100);
      newRows[index].amount = amount.toFixed(2);
    }

    setItemRows(newRows);
  };

  // Add a new item row
  const addItemRow = () => {
    setItemRows([...itemRows, {
      drug: '',
      batchNumber: '',
      expiryDate: '',
      mrp: '',
      ptr: '',
      quantity: '',
      freeQuantity: '0',
      disc: '0',
      amount: '0'
    }]);
  };

  // Remove an item row
  const removeItemRow = (index) => {
    if (itemRows.length > 1) {
      const newRows = [...itemRows];
      newRows.splice(index, 1);
      setItemRows(newRows);
    } else {
      toast.warning("At least one item is required");
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalItems = itemRows.length;
    const totalValue = itemRows.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    // For simplicity, we're not calculating GST here
    const totalGST = 0;

    return { totalItems, totalValue, totalGST };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.supplier || !formData.invoiceNumber || !formData.invoiceDate || !formData.dueDate) {
        toast.error("Supplier, invoice number, invoice date, and due date are required");
        setLoading(false);
        return;
      }

      // Validate item rows
      const invalidItems = itemRows.some(item =>
        !item.drug || !item.batchNumber || !item.expiryDate || !item.mrp || !item.ptr || !item.quantity
      );

      if (invalidItems) {
        toast.error("All item fields are required");
        setLoading(false);
        return;
      }

      // Calculate totals
      const { totalItems, totalValue, totalGST } = calculateTotals();

      // Prepare data for API
      const stockEntryData = {
        supplier: formData.supplier,
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        itemDetails: itemRows,
        status: formData.status,
        totalItems,
        totalValue,
        totalGST
      };

      console.log("Sending stock entry data:", stockEntryData);

      // Add stock entry
      const response = await addStockEntry(stockEntryData);
      console.log("Stock entry added response:", response);
      toast.success(response.message || "Stock entry added successfully");

      // Navigate back to stock entry list
      setTimeout(() => {
        navigate("/inventory/stock-entry");
      }, 2000);

    } catch (err) {
      console.error("Error adding stock entry:", err);
      toast.error(err.message || "Failed to add stock entry");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/inventory/stock-entry");
  };

  // Calculate total quantity and amount for display
  const totalQty = itemRows.reduce((sum, item) => sum + (parseInt(item.quantity) || 0) + (parseInt(item.freeQuantity) || 0), 0);
  const totalAmount = itemRows.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Add Stock Entry</h1>
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
            form="stockEntryForm"
            className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Stock Entry'}
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE] overflow-auto">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        )}

        {!loading && (
          <form id="stockEntryForm" onSubmit={handleSubmit}>
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
              {/* Invoice Details Section */}
              <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
                <h2 className="text-lg font-medium text-gray-600 mb-4">INVOICE DETAILS</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="supplier"
                        className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        value={formData.supplier}
                        onChange={handleSupplierChange}
                        required
                      >
                        <option value="">Select Supplier</option>
                        <option value="test Supplier">test Supplier</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier._id} value={supplier.name}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      placeholder="Enter invoice number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="invoiceDate"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        value={formData.invoiceDate}
                        onChange={handleChange}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CalendarIcon />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dueDate"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CalendarIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Details Section */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-medium text-gray-600 mb-4">ITEM DETAILS</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">DRUG</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">BATCH NUMBER</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">EXPIRY DATE</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">MRP</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">PTR</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">QTY</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">FREE QTY</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">DISC %</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">AMOUNT</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemRows.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-4 py-2">
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={item.drug}
                                onChange={(e) => handleItemChange(index, 'drug', e.target.value)}
                                placeholder="Drug name"
                                required
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={item.batchNumber}
                              onChange={(e) => handleItemChange(index, 'batchNumber', e.target.value)}
                              placeholder="Batch number"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <div className="relative">
                              <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                value={item.expiryDate}
                                onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                                required
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <CalendarIcon />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={item.mrp}
                              onChange={(e) => handleItemChange(index, 'mrp', e.target.value)}
                              placeholder="MRP"
                              step="0.01"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={item.ptr}
                              onChange={(e) => handleItemChange(index, 'ptr', e.target.value)}
                              placeholder="PTR"
                              step="0.01"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-16 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              placeholder="Qty"
                              required
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-16 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={item.freeQuantity}
                              onChange={(e) => handleItemChange(index, 'freeQuantity', e.target.value)}
                              placeholder="Free"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-16 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={item.disc}
                              onChange={(e) => handleItemChange(index, 'disc', e.target.value)}
                              placeholder="Disc %"
                              step="0.01"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={item.amount}
                              readOnly
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              className="p-1 rounded-full hover:bg-gray-100"
                              onClick={() => removeItemRow(index)}
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    onClick={addItemRow}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add items
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 mb-2">
                      <span className="text-gray-700 font-medium">Total QTY:</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{totalQty}</span>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-gray-700 font-medium">Total Amount:</span>
                      <span className="text-lg font-bold">{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <span className="text-gray-700 font-medium">Status:</span>
                      <select
                        name="status"
                        className="p-2 border rounded border-gray-300"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                      </select>
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

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);