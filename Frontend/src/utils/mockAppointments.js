/**
 * Mock appointments data for testing
 */
import { mockPatients } from './mockPatients';

// Get current date
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const mockAppointments = [
  {
    _id: '1',
    patientId: '1',
    patientName: `${mockPatients[0].firstName} ${mockPatients[0].lastName}`,
    appointmentDate: formatDate(today),
    appointmentTime: '09:00 AM',
    reason: 'Regular checkup',
    status: 'Scheduled',
    doctorId: '1',
    doctorName: 'Dr. Sharma',
    department: 'General Medicine',
    notes: 'Patient has been experiencing mild fever for 2 days'
  },
  {
    _id: '2',
    patientId: '2',
    patientName: `${mockPatients[1].firstName} ${mockPatients[1].lastName}`,
    appointmentDate: formatDate(today),
    appointmentTime: '10:30 AM',
    reason: 'Follow-up',
    status: 'Completed',
    doctorId: '2',
    doctorName: 'Dr. Patel',
    department: 'Cardiology',
    notes: 'Follow-up after heart medication adjustment'
  },
  {
    _id: '3',
    patientId: '3',
    patientName: `${mockPatients[2].firstName} ${mockPatients[2].lastName}`,
    appointmentDate: formatDate(today),
    appointmentTime: '02:00 PM',
    reason: 'Consultation',
    status: 'Awaiting',
    doctorId: '1',
    doctorName: 'Dr. Sharma',
    department: 'General Medicine',
    notes: 'New patient consultation for chronic back pain'
  },
  {
    _id: '4',
    patientId: '4',
    patientName: `${mockPatients[3].firstName} ${mockPatients[3].lastName}`,
    appointmentDate: formatDate(tomorrow),
    appointmentTime: '11:00 AM',
    reason: 'Vaccination',
    status: 'Scheduled',
    doctorId: '3',
    doctorName: 'Dr. Gupta',
    department: 'Pediatrics',
    notes: 'Routine vaccination'
  },
  {
    _id: '5',
    patientId: '5',
    patientName: `${mockPatients[4].firstName} ${mockPatients[4].lastName}`,
    appointmentDate: formatDate(nextWeek),
    appointmentTime: '03:30 PM',
    reason: 'Follow-up',
    status: 'Scheduled',
    doctorId: '4',
    doctorName: 'Dr. Khan',
    department: 'Orthopedics',
    notes: 'Post-surgery follow-up'
  },
  {
    _id: '6',
    patientId: '1',
    patientName: `${mockPatients[0].firstName} ${mockPatients[0].lastName}`,
    appointmentDate: formatDate(nextMonth),
    appointmentTime: '09:30 AM',
    reason: 'Annual checkup',
    status: 'Scheduled',
    doctorId: '1',
    doctorName: 'Dr. Sharma',
    department: 'General Medicine',
    notes: 'Annual physical examination'
  }
];

/**
 * Get all appointments
 * @returns {Array} Array of appointment objects
 */
export const getAllAppointments = () => {
  return mockAppointments;
};

/**
 * Get appointment by ID
 * @param {string} id - Appointment ID
 * @returns {Object|null} Appointment object or null if not found
 */
export const getAppointmentById = (id) => {
  return mockAppointments.find(appointment => appointment._id === id) || null;
};

/**
 * Get appointments by patient ID
 * @param {string} patientId - Patient ID
 * @returns {Array} Array of appointment objects
 */
export const getAppointmentsByPatientId = (patientId) => {
  return mockAppointments.filter(appointment => appointment.patientId === patientId);
};

/**
 * Get appointments by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} Array of appointment objects
 */
export const getAppointmentsByDate = (date) => {
  return mockAppointments.filter(appointment => appointment.appointmentDate === date);
};

/**
 * Get appointments by status
 * @param {string} status - Appointment status
 * @returns {Array} Array of appointment objects
 */
export const getAppointmentsByStatus = (status) => {
  return mockAppointments.filter(appointment => appointment.status === status);
};
