import api from './api';

// Manufacturer Services
export const getAllManufacturers = async () => {
  try {
    // Include the /api prefix
    const response = await api.get('/api/inventory/manufacturer/all-manufacturers');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addManufacturer = async (manufacturerData) => {
  try {
    console.log('API call: Adding manufacturer with data:', manufacturerData);
    // Include the /api prefix
    const response = await api.post('/api/inventory/manufacturer/add-manufacturer', manufacturerData);
    console.log('API response for add manufacturer:', response);
    return response.data;
  } catch (error) {
    console.error('API error in addManufacturer:', error);
    console.error('Error response:', error.response?.data);
    throw error.response?.data || error.message || 'Failed to add manufacturer';
  }
};

export const updateManufacturer = async (id, manufacturerData) => {
  try {
    // Include the /api prefix
    const response = await api.put(`/api/inventory/manufacturer/edit-manufacturer/${id}`, manufacturerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Supplier Services
export const getAllSuppliers = async () => {
  try {
    // Include the /api prefix
    const response = await api.get('/api/inventory/supplier/all-suppliers');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addSupplier = async (supplierData) => {
  try {
    console.log('API call: Adding supplier with data:', supplierData);
    // Include the /api prefix
    const response = await api.post('/api/inventory/supplier/add-supplier', supplierData);
    console.log('API response for add supplier:', response);
    return response.data;
  } catch (error) {
    console.error('API error in addSupplier:', error);
    console.error('Error response:', error.response?.data);
    throw error.response?.data || error.message || 'Failed to add supplier';
  }
};

export const updateSupplier = async (id, supplierData) => {
  try {
    // Include the /api prefix
    const response = await api.put(`/api/inventory/supplier/edit-supplier/${id}`, supplierData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Drug Services
export const getAllDrugs = async () => {
  try {
    // Include the /api prefix
    const response = await api.get('/api/inventory/drug/all-drugs');
    console.log('getAllDrugs response:', response);
    return response.data;
  } catch (error) {
    console.error('getAllDrugs error:', error);
    throw error.response?.data || error.message;
  }
};

export const getDrugById = async (id) => {
  try {
    // Include the /api prefix
    const response = await api.get(`/api/inventory/drug/get-drug/${id}`);
    console.log('getDrugById response:', response);
    return response.data;
  } catch (error) {
    console.error('getDrugById error:', error);
    throw error.response?.data || error.message;
  }
};

export const addDrug = async (drugData) => {
  try {
    // Include the /api prefix
    const response = await api.post('/api/inventory/drug/add-drug', drugData);
    console.log('addDrug response:', response);
    return response.data;
  } catch (error) {
    console.error('addDrug error:', error);
    throw error.response?.data || error.message;
  }
};

export const updateDrug = async (id, drugData) => {
  try {
    // Include the /api prefix
    const response = await api.put(`/api/inventory/drug/edit-drug/${id}`, drugData);
    console.log('updateDrug response:', response);
    return response.data;
  } catch (error) {
    console.error('updateDrug error:', error);
    throw error.response?.data || error.message;
  }
};

export const deleteDrug = async (id) => {
  try {
    // Include the /api prefix
    const response = await api.delete(`/api/inventory/drug/delete-drug/${id}`);
    console.log('deleteDrug response:', response);
    return response.data;
  } catch (error) {
    console.error('deleteDrug error:', error);
    throw error.response?.data || error.message;
  }
};

// Stock Entry Services
export const getAllStockEntries = async () => {
  try {
    // Include the /api prefix
    const response = await api.get('/api/inventory/stock-entry/get-stocks');
    console.log('getAllStockEntries response:', response);
    return response.data;
  } catch (error) {
    console.error('getAllStockEntries error:', error);
    throw error.response?.data || error.message;
  }
};

export const getStockEntryById = async (id) => {
  try {
    // Include the /api prefix
    const response = await api.get(`/api/inventory/stock-entry/get-stock/${id}`);
    console.log('getStockEntryById response:', response);
    return response.data;
  } catch (error) {
    console.error('getStockEntryById error:', error);
    throw error.response?.data || error.message;
  }
};

export const addStockEntry = async (stockEntryData) => {
  try {
    // Include the /api prefix
    const response = await api.post('/api/inventory/stock-entry/add-stock', stockEntryData);
    console.log('addStockEntry response:', response);
    return response.data;
  } catch (error) {
    console.error('addStockEntry error:', error);
    throw error.response?.data || error.message;
  }
};

export const updateStockEntry = async (id, stockEntryData) => {
  try {
    // Include the /api prefix
    const response = await api.put(`/api/inventory/stock-entry/edit-stock/${id}`, stockEntryData);
    console.log('updateStockEntry response:', response);
    return response.data;
  } catch (error) {
    console.error('updateStockEntry error:', error);
    throw error.response?.data || error.message;
  }
};

export const deleteStockEntry = async (id) => {
  try {
    // Include the /api prefix
    const response = await api.delete(`/api/inventory/stock-entry/delete-stock/${id}`);
    console.log('deleteStockEntry response:', response);
    return response.data;
  } catch (error) {
    console.error('deleteStockEntry error:', error);
    throw error.response?.data || error.message;
  }
};

export const getInvoiceDetails = async (supplier, invoiceDate) => {
  try {
    // Include the /api prefix
    const response = await api.get(`/api/inventory/stock-entry/get-default-details?supplier=${supplier}&invoiceDate=${invoiceDate}`);
    console.log('getInvoiceDetails response:', response);
    return response.data;
  } catch (error) {
    console.error('getInvoiceDetails error:', error);
    throw error.response?.data || error.message;
  }
};

// Stock Adjustment Services
export const getAllStockAdjustments = async () => {
  try {
    console.log('Fetching all stock adjustments');
    const response = await api.get('/api/inventory/stock-adjustment/get-stock-adjustments');
    console.log('getAllStockAdjustments response:', response);
    return response.data;
  } catch (error) {
    console.error('getAllStockAdjustments error:', error);
    throw error.response?.data || error.message;
  }
};

export const addStockAdjustment = async (adjustmentData) => {
  try {
    console.log('Adding stock adjustment with data:', adjustmentData);

    // Ensure all required fields are present
    if (!adjustmentData.itemName) {
      console.error('Missing itemName in adjustmentData');
      throw new Error('Item name is required');
    }

    if (!adjustmentData.batchNumber) {
      console.error('Missing batchNumber in adjustmentData');
      throw new Error('Batch number is required');
    }

    if (adjustmentData.currStock === undefined) {
      console.error('Missing currStock in adjustmentData');
      throw new Error('Current stock is required');
    }

    if (adjustmentData.adjustmentValue === undefined) {
      console.error('Missing adjustmentValue in adjustmentData');
      throw new Error('Adjustment value is required');
    }

    if (!adjustmentData.reason) {
      console.error('Missing reason in adjustmentData');
      throw new Error('Reason is required');
    }

    const response = await api.post('/api/inventory/stock-adjustment/add-stock-adjustment', adjustmentData);
    console.log('addStockAdjustment response:', response);
    return response.data;
  } catch (error) {
    console.error('addStockAdjustment error:', error);
    console.error('Error details:', error.response?.data);
    throw error.response?.data || { message: error.message };
  }
};

export const searchStock = async (drugName) => {
  try {
    console.log('Searching stock for drug:', drugName);
    const response = await api.get(`/api/inventory/stock-adjustment/search-stock?drugName=${encodeURIComponent(drugName)}`);
    console.log('searchStock response:', response);
    return response.data;
  } catch (error) {
    console.error('searchStock error:', error);
    throw error.response?.data || error.message;
  }
};

// Stock Migration Services
export const previewStockMigration = async (formData) => {
  try {
    console.log('Previewing stock migration with file');

    // Log the FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1]);
    }

    // Use different headers for FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Increase timeout for large files
      timeout: 30000,
    };

    console.log('Sending preview request to:', '/api/inventory/stock-migration/show-preview');
    const response = await api.post('/api/inventory/stock-migration/show-preview', formData, config);
    console.log('previewStockMigration response:', response);

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('previewStockMigration error:', error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }

    throw error.response?.data || { message: error.message };
  }
};

export const addStockMigration = async (formData) => {
  try {
    console.log('Adding stock migration with file');

    // Log the FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1]);
    }

    // Use different headers for FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Increase timeout for large files
      timeout: 60000,
    };

    console.log('Sending migration request to:', '/api/inventory/stock-migration/add-stock-migration');
    const response = await api.post('/api/inventory/stock-migration/add-stock-migration', formData, config);
    console.log('addStockMigration response:', response);

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('addStockMigration error:', error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }

    throw error.response?.data || { message: error.message };
  }
};
