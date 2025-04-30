import api from './api';

// OP Assessment Services
export const getAllOPAssessments = async () => {
  try {
    const response = await api.get('/nurse/assessment/op');
    return response.data;
  } catch (error) {
    console.error('Error fetching OP assessments:', error);
    throw error.response?.data || error.message || 'Failed to fetch OP assessments';
  }
};

export const getOPAssessmentById = async (id) => {
  try {
    const response = await api.get(`/nurse/assessment/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching OP assessment for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch OP assessment';
  }
};

export const getPatientAssessments = async (patientId) => {
  try {
    const response = await api.get(`/nurse/assessment/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching assessments for patient ID ${patientId}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch patient assessments';
  }
};

export const addOPAssessment = async (assessmentData) => {
  try {
    const response = await api.post('/nurse/assessment/add', assessmentData);
    return response.data;
  } catch (error) {
    console.error('Error adding OP assessment:', error);
    throw error.response?.data || error.message || 'Failed to add OP assessment';
  }
};

export const updateOPAssessment = async (id, assessmentData) => {
  try {
    const response = await api.put(`/nurse/assessment/${id}`, assessmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating OP assessment for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to update OP assessment';
  }
};

// IP Care Management Services
export const getAllIPCareManagements = async () => {
  try {
    const response = await api.get('/nurse/care/ip');
    return response.data;
  } catch (error) {
    console.error('Error fetching IP care managements:', error);
    throw error.response?.data || error.message || 'Failed to fetch IP care managements';
  }
};

export const getIPCareManagementById = async (id) => {
  try {
    const response = await api.get(`/nurse/care/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching IP care management for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch IP care management';
  }
};

export const getPatientCareManagements = async (patientId) => {
  try {
    const response = await api.get(`/nurse/care/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching care managements for patient ID ${patientId}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch patient care managements';
  }
};

export const getAdmissionCareManagements = async (admissionId) => {
  try {
    const response = await api.get(`/nurse/care/admission/${admissionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching care managements for admission ID ${admissionId}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch admission care managements';
  }
};

export const addIPCareManagement = async (careData) => {
  try {
    const response = await api.post('/nurse/care/add', careData);
    return response.data;
  } catch (error) {
    console.error('Error adding IP care management:', error);
    throw error.response?.data || error.message || 'Failed to add IP care management';
  }
};

export const updateIPCareManagement = async (id, careData) => {
  try {
    const response = await api.put(`/nurse/care/${id}`, careData);
    return response.data;
  } catch (error) {
    console.error(`Error updating IP care management for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to update IP care management';
  }
};

// Admission Notes Services
export const getAllAdmissionNotes = async () => {
  try {
    const response = await api.get('/nurse/admission-note/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching admission notes:', error);
    throw error.response?.data || error.message || 'Failed to fetch admission notes';
  }
};

export const getAdmissionNoteById = async (id) => {
  try {
    const response = await api.get(`/nurse/admission-note/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching admission note for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch admission note';
  }
};

export const getAdmissionNotesByAdmissionId = async (admissionId) => {
  try {
    const response = await api.get(`/nurse/admission-note/admission/${admissionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching admission notes for admission ID ${admissionId}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch admission notes';
  }
};

export const getAdmissionNotesByPatientId = async (patientId) => {
  try {
    const response = await api.get(`/nurse/admission-note/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching admission notes for patient ID ${patientId}:`, error);
    throw error.response?.data || error.message || 'Failed to fetch admission notes';
  }
};

export const addAdmissionNote = async (noteData) => {
  try {
    const response = await api.post('/nurse/admission-note/add', noteData);
    return response.data;
  } catch (error) {
    console.error('Error adding admission note:', error);
    throw error.response?.data || error.message || 'Failed to add admission note';
  }
};

export const updateAdmissionNote = async (id, noteData) => {
  try {
    const response = await api.put(`/nurse/admission-note/${id}`, noteData);
    return response.data;
  } catch (error) {
    console.error(`Error updating admission note for ID ${id}:`, error);
    throw error.response?.data || error.message || 'Failed to update admission note';
  }
};
