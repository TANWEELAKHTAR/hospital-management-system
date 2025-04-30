import api from './api';

// Import mock data for testing
import { mockPatients, getPatientById as getMockPatientById, getAllPatients as getMockAllPatients } from '../utils/mockPatients';

// Patient Registration Services
export const newPatientRegistration = async (patientData) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.post('/reception/patient/register', patientData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create a mock response
    const newPatient = {
      _id: `${Date.now()}`,
      mrn: `MRN${Math.floor(Math.random() * 10000)}`,
      ...patientData,
      isAdmitted: false
    };

    console.log('New patient registered:', newPatient);
    return newPatient;
  } catch (error) {
    console.error('API Error in newPatientRegistration:', error);
    throw error.message || 'Failed to register patient';
  }
};

export const getPatientById = async (patientId) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get(`/reception/patient/${patientId}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const patient = getMockPatientById(patientId);

    if (!patient) {
      throw new Error(`Patient with ID ${patientId} not found`);
    }

    return patient;
  } catch (error) {
    console.error(`Error in getPatientById for ID ${patientId}:`, error);
    throw error.message || 'Failed to get patient details';
  }
};

export const getAllPatients = async () => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get('/reception/patient/all');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return getMockAllPatients();
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    throw error.message || 'Failed to get patients';
  }
};

// Patient Admission Services
export const admitPatient = async (admissionData) => {
  try {
    const response = await api.post('/admission/admit', admissionData);
    return response.data;
  } catch (error) {
    console.error('API Error in admitPatient:', error);
    throw error.response?.data || error.message || 'Failed to admit patient';
  }
};

export const getAdmissionById = async (admissionId) => {
  try {
    const response = await api.get(`/admission/${admissionId}`);
    return response.data;
  } catch (error) {
    console.error(`API Error in getAdmissionById for ID ${admissionId}:`, error);
    throw error.response?.data || error.message || 'Failed to get admission details';
  }
};

export const getAllAdmissions = async () => {
  try {
    const response = await api.get('/admission/all');
    return response.data;
  } catch (error) {
    console.error('API Error in getAllAdmissions:', error);
    throw error.response?.data || error.message || 'Failed to get admissions';
  }
};

// Appointment Services
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointment/book', appointmentData);
    return response.data;
  } catch (error) {
    console.error('API Error in bookAppointment:', error);
    throw error.response?.data || error.message || 'Failed to book appointment';
  }
};

export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await api.get(`/appointment/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error(`API Error in getAppointmentById for ID ${appointmentId}:`, error);
    throw error.response?.data || error.message || 'Failed to get appointment details';
  }
};

export const getAllAppointments = async () => {
  try {
    const response = await api.get('/appointment/all');
    return response.data;
  } catch (error) {
    console.error('API Error in getAllAppointments:', error);
    throw error.response?.data || error.message || 'Failed to get appointments';
  }
};

// Medical Services
export const getAllServices = async () => {
  try {
    const response = await api.get('/service/all');
    return response.data;
  } catch (error) {
    console.error('API Error in getAllServices:', error);
    throw error.response?.data || error.message || 'Failed to get services';
  }
};

export const getServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`API Error in getServiceById for ID ${serviceId}:`, error);
    throw error.response?.data || error.message || 'Failed to get service details';
  }
};

export const addService = async (serviceData) => {
  try {
    const response = await api.post('/service/add', serviceData);
    return response.data;
  } catch (error) {
    console.error('API Error in addService:', error);
    throw error.response?.data || error.message || 'Failed to add service';
  }
};

export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await api.put(`/service/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    console.error(`API Error in updateService for ID ${serviceId}:`, error);
    throw error.response?.data || error.message || 'Failed to update service';
  }
};

export const deleteService = async (serviceId) => {
  try {
    const response = await api.delete(`/service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`API Error in deleteService for ID ${serviceId}:`, error);
    throw error.response?.data || error.message || 'Failed to delete service';
  }
};

// Import mock referrals data
import { mockReferrals, getReferralById as getMockReferralById, getAllReferrals as getMockAllReferrals } from '../utils/mockReferrals';

// Referral Services
export const addReferral = async (referralData) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.post('/reception/referral/add', referralData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create a mock response with a new ID
    const newReferral = {
      _id: `${Date.now()}`,
      ...referralData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real app, this would be handled by the backend
    mockReferrals.push(newReferral);

    console.log('New referral added:', newReferral);
    return newReferral;
  } catch (error) {
    console.error('Error in addReferral:', error);
    throw error.message || 'Failed to add referral';
  }
};

export const editReferral = async (id, referralData) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.put(`/reception/referral/${id}`, referralData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Find the referral to update
    const referralIndex = mockReferrals.findIndex(ref => ref._id === id);

    if (referralIndex === -1) {
      throw new Error(`Referral with ID ${id} not found`);
    }

    // Update the referral
    const updatedReferral = {
      ...mockReferrals[referralIndex],
      ...referralData,
      updatedAt: new Date().toISOString()
    };

    // Replace the old referral with the updated one
    mockReferrals[referralIndex] = updatedReferral;

    console.log('Referral updated:', updatedReferral);
    return updatedReferral;
  } catch (error) {
    console.error(`Error in editReferral for ID ${id}:`, error);
    throw error.message || 'Failed to edit referral';
  }
};

export const getReferral = async (id) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get(`/reception/referral/${id}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const referral = getMockReferralById(id);

    if (!referral) {
      throw new Error(`Referral with ID ${id} not found`);
    }

    return referral;
  } catch (error) {
    console.error(`Error in getReferral for ID ${id}:`, error);
    throw error.message || 'Failed to get referral';
  }
};

export const getAllReferrals = async () => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get('/reception/referral/all');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return getMockAllReferrals();
  } catch (error) {
    console.error('Error in getAllReferrals:', error);
    throw error.message || 'Failed to get referrals';
  }
};

export const deleteReferral = async (id) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.delete(`/reception/referral/${id}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Find the referral to delete
    const referralIndex = mockReferrals.findIndex(ref => ref._id === id);

    if (referralIndex === -1) {
      throw new Error(`Referral with ID ${id} not found`);
    }

    // Remove the referral from the array
    const deletedReferral = mockReferrals.splice(referralIndex, 1)[0];

    console.log('Referral deleted:', deletedReferral);
    return { success: true, message: 'Referral deleted successfully' };
  } catch (error) {
    console.error(`Error in deleteReferral for ID ${id}:`, error);
    throw error.message || 'Failed to delete referral';
  }
};
