import api from './api';

// Test Parameters Services
export const getAllTestParameters = async () => {
  try {
    const response = await api.get('/lab/parameter/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching test parameters:', error);
    throw error.response?.data || error.message || 'Failed to fetch test parameters';
  }
};

export const getTestParameterById = async (id) => {
  try {
    const response = await api.get(`/lab/parameter/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching test parameter for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch test parameter';
  }
};

export const addTestParameter = async (parameterData) => {
  try {
    const response = await api.post('/lab/parameter/add', parameterData);
    return response.data;
  } catch (error) {
    console.error('Error adding test parameter:', error);
    throw error.response?.data || error.message || 'Failed to add test parameter';
  }
};

export const updateTestParameter = async (id, parameterData) => {
  try {
    const response = await api.put(`/lab/parameter/${id}`, parameterData);
    return response.data;
  } catch (error) {
    console.error(`Error updating test parameter for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to update test parameter';
  }
};

// Lab Tests Services
export const getAllLabTests = async () => {
  try {
    const response = await api.get('/lab/test/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching lab tests:', error);
    throw error.response?.data || error.message || 'Failed to fetch lab tests';
  }
};

export const getLabTestById = async (id) => {
  try {
    const response = await api.get(`/lab/test/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab test for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch lab test';
  }
};

export const getPatientLabTests = async (patientId) => {
  try {
    const response = await api.get(`/lab/test/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab tests for patient ID ${patientId}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch patient lab tests';
  }
};

export const addLabTest = async (testData) => {
  try {
    const response = await api.post('/lab/test/add', testData);
    return response.data;
  } catch (error) {
    console.error('Error adding lab test:', error);
    throw error.response?.data || error.message || 'Failed to add lab test';
  }
};

export const updateLabTest = async (id, testData) => {
  try {
    const response = await api.put(`/lab/test/${id}`, testData);
    return response.data;
  } catch (error) {
    console.error(`Error updating lab test for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to update lab test';
  }
};

// Lab Reports Services
export const getAllLabReports = async () => {
  try {
    const response = await api.get('/lab/report/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching lab reports:', error);
    throw error.response?.data || error.message || 'Failed to fetch lab reports';
  }
};

export const getLabReportById = async (id) => {
  try {
    const response = await api.get(`/lab/report/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab report for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch lab report';
  }
};

export const getPatientLabReports = async (patientId) => {
  try {
    const response = await api.get(`/lab/report/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab reports for patient ID ${patientId}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch patient lab reports';
  }
};

export const getLabReportsByTestId = async (testId) => {
  try {
    const response = await api.get(`/lab/report/test/${testId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab reports for test ID ${testId}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch test lab reports';
  }
};

export const addLabReport = async (reportData) => {
  try {
    const response = await api.post('/lab/report/add', reportData);
    return response.data;
  } catch (error) {
    console.error('Error adding lab report:', error);
    throw error.response?.data || error.message || 'Failed to add lab report';
  }
};

export const updateLabReport = async (id, reportData) => {
  try {
    const response = await api.put(`/lab/report/${id}`, reportData);
    return response.data;
  } catch (error) {
    console.error(`Error updating lab report for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to update lab report';
  }
};
