import api from './api';

// Import mock data for testing
import { mockAppointments, getAllAppointments as getMockAllAppointments } from '../utils/mockAppointments';
import { getPatientById as getMockPatientById } from '../utils/mockPatients';

// OP Queue Services
export const getOPQueue = async () => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get('/doctor/queue');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return getMockAllAppointments();
  } catch (error) {
    console.error('Error fetching OP queue:', error);
    throw error.message || 'Failed to fetch OP queue';
  }
};

export const getPatientDetails = async (patientId) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get(`/patient/${patientId}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const patient = getMockPatientById(patientId);

    if (!patient) {
      throw new Error(`Patient with ID ${patientId} not found`);
    }

    return patient;
  } catch (error) {
    console.error(`Error fetching patient details for ID ${patientId}:`, error);
    throw error.message || 'Failed to fetch patient details';
  }
};

export const getPatientMedicalHistory = async (patientId) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get(`/patient/${patientId}/medical-history`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Create mock medical history
    const mockMedicalHistory = {
      patientId,
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension'],
      pastSurgeries: [
        {
          procedure: 'Appendectomy',
          date: '2018-05-12',
          hospital: 'City General Hospital'
        }
      ],
      familyHistory: [
        {
          condition: 'Diabetes',
          relation: 'Father'
        },
        {
          condition: 'Hypertension',
          relation: 'Mother'
        }
      ],
      socialHistory: {
        smoking: 'Never',
        alcohol: 'Occasional',
        exercise: 'Regular'
      },
      medications: [
        {
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily'
        }
      ]
    };

    return mockMedicalHistory;
  } catch (error) {
    console.error(`Error fetching medical history for patient ID ${patientId}:`, error);
    throw error.message || 'Failed to fetch medical history';
  }
};

export const saveMedicalForm = async (patientId, formData) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.post(`/doctor/medical-form/${patientId}`, formData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Create mock response
    const mockResponse = {
      id: `form-${Date.now()}`,
      patientId,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'saved'
    };

    console.log('Medical form saved:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error(`Error saving medical form for patient ID ${patientId}:`, error);
    throw error.message || 'Failed to save medical form';
  }
};

export const prescribeMedication = async (patientId, medicationData) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.post(`/doctor/prescribe/${patientId}`, medicationData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create mock response
    const mockResponse = {
      id: `prescription-${Date.now()}`,
      patientId,
      medications: medicationData.medications || [],
      instructions: medicationData.instructions || '',
      prescribedBy: 'Dr. Test Doctor',
      prescribedDate: new Date().toISOString(),
      status: 'active'
    };

    console.log('Medication prescribed:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error(`Error prescribing medication for patient ID ${patientId}:`, error);
    throw error.message || 'Failed to prescribe medication';
  }
};

// IP Dashboard Services
export const getIPDashboard = async () => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get('/doctor/ip-dashboard');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create mock IP dashboard data
    const mockIPDashboard = {
      admittedPatients: [
        {
          id: '2',
          name: 'Priya Sharma',
          age: 33,
          gender: 'Female',
          roomNumber: '101',
          admissionDate: '2023-06-15',
          diagnosis: 'Pneumonia',
          doctor: 'Dr. Patel',
          status: 'Stable'
        },
        {
          id: '5',
          name: 'Vikram Singh',
          age: 43,
          gender: 'Male',
          roomNumber: '205',
          admissionDate: '2023-06-10',
          diagnosis: 'Post-operative care',
          doctor: 'Dr. Khan',
          status: 'Improving'
        }
      ],
      stats: {
        totalAdmitted: 2,
        availableBeds: 18,
        criticalPatients: 0,
        dischargesScheduled: 1
      }
    };

    return mockIPDashboard;
  } catch (error) {
    console.error('Error fetching IP dashboard:', error);
    throw error.message || 'Failed to fetch IP dashboard';
  }
};

export const getAdmittedPatients = async () => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get('/admission/active');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Use the admitted patients from the IP dashboard mock data
    const mockAdmittedPatients = [
      {
        id: '2',
        name: 'Priya Sharma',
        age: 33,
        gender: 'Female',
        roomNumber: '101',
        admissionDate: '2023-06-15',
        diagnosis: 'Pneumonia',
        doctor: 'Dr. Patel',
        status: 'Stable'
      },
      {
        id: '5',
        name: 'Vikram Singh',
        age: 43,
        gender: 'Male',
        roomNumber: '205',
        admissionDate: '2023-06-10',
        diagnosis: 'Post-operative care',
        doctor: 'Dr. Khan',
        status: 'Improving'
      }
    ];

    return mockAdmittedPatients;
  } catch (error) {
    console.error('Error fetching admitted patients:', error);
    throw error.message || 'Failed to fetch admitted patients';
  }
};

export const getAdmittedPatientDetails = async (admissionId) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.get(`/admission/${admissionId}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Mock admitted patients
    const mockAdmittedPatients = {
      '2': {
        id: '2',
        patientId: '2',
        name: 'Priya Sharma',
        age: 33,
        gender: 'Female',
        roomNumber: '101',
        admissionDate: '2023-06-15',
        diagnosis: 'Pneumonia',
        doctor: 'Dr. Patel',
        status: 'Stable',
        vitalSigns: {
          temperature: '38.2°C',
          bloodPressure: '120/80 mmHg',
          heartRate: '88 bpm',
          respiratoryRate: '18 breaths/min',
          oxygenSaturation: '96%'
        },
        medications: [
          {
            name: 'Azithromycin',
            dosage: '500mg',
            frequency: 'Once daily',
            route: 'Oral'
          },
          {
            name: 'Paracetamol',
            dosage: '650mg',
            frequency: 'Every 6 hours as needed',
            route: 'Oral'
          }
        ],
        notes: [
          {
            date: '2023-06-15',
            time: '10:00 AM',
            author: 'Dr. Patel',
            content: 'Patient admitted with fever, cough, and shortness of breath. Chest X-ray shows consolidation in right lower lobe. Started on antibiotics.'
          },
          {
            date: '2023-06-16',
            time: '09:30 AM',
            author: 'Dr. Patel',
            content: 'Patient reporting slight improvement in symptoms. Fever reduced. Continue current treatment.'
          }
        ]
      },
      '5': {
        id: '5',
        patientId: '5',
        name: 'Vikram Singh',
        age: 43,
        gender: 'Male',
        roomNumber: '205',
        admissionDate: '2023-06-10',
        diagnosis: 'Post-operative care',
        doctor: 'Dr. Khan',
        status: 'Improving',
        vitalSigns: {
          temperature: '37.0°C',
          bloodPressure: '130/85 mmHg',
          heartRate: '72 bpm',
          respiratoryRate: '16 breaths/min',
          oxygenSaturation: '98%'
        },
        medications: [
          {
            name: 'Tramadol',
            dosage: '50mg',
            frequency: 'Every 6 hours as needed',
            route: 'Oral'
          },
          {
            name: 'Cefuroxime',
            dosage: '500mg',
            frequency: 'Twice daily',
            route: 'Oral'
          }
        ],
        notes: [
          {
            date: '2023-06-10',
            time: '02:00 PM',
            author: 'Dr. Khan',
            content: 'Patient admitted post-surgery for knee replacement. Vital signs stable. Pain controlled with medication.'
          },
          {
            date: '2023-06-12',
            time: '10:15 AM',
            author: 'Dr. Khan',
            content: 'Wound healing well. Physical therapy initiated. Patient able to stand with assistance.'
          },
          {
            date: '2023-06-14',
            time: '11:00 AM',
            author: 'Dr. Khan',
            content: 'Continued improvement. Patient able to walk short distances with walker. Pain well-controlled.'
          }
        ]
      }
    };

    const patientDetails = mockAdmittedPatients[admissionId];

    if (!patientDetails) {
      throw new Error(`Admitted patient with ID ${admissionId} not found`);
    }

    return patientDetails;
  } catch (error) {
    console.error(`Error fetching admitted patient details for admission ID ${admissionId}:`, error);
    throw error.message || 'Failed to fetch admitted patient details';
  }
};

export const updatePatientStatus = async (admissionId, statusData) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.put(`/admission/${admissionId}/status`, statusData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Create mock response
    const mockResponse = {
      id: admissionId,
      status: statusData.status,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Dr. Test Doctor'
    };

    console.log('Patient status updated:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error(`Error updating patient status for admission ID ${admissionId}:`, error);
    throw error.message || 'Failed to update patient status';
  }
};

export const dischargePatient = async (admissionId, dischargeData) => {
  try {
    // For testing purposes, we'll use mock data instead of API call
    // In a real application, you would use the API call below
    // const response = await api.post(`/admission/${admissionId}/discharge`, dischargeData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create mock response
    const mockResponse = {
      id: admissionId,
      dischargeDate: new Date().toISOString(),
      dischargeSummary: dischargeData.dischargeSummary || 'Patient discharged in stable condition.',
      followUpInstructions: dischargeData.followUpInstructions || 'Follow up in 2 weeks.',
      dischargedBy: 'Dr. Test Doctor',
      status: 'discharged'
    };

    console.log('Patient discharged:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error(`Error discharging patient for admission ID ${admissionId}:`, error);
    throw error.message || 'Failed to discharge patient';
  }
};
