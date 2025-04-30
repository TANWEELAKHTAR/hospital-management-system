/**
 * Mock patients data for testing
 */

export const mockPatients = [
  {
    _id: '1',
    mrn: 'MRN001',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1985-05-15',
    age: '38',
    gender: 'Male',
    phone: '9876543210',
    email: 'john.doe@example.com',
    address: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    emergencyContactName: 'Jane Doe',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '9876543211',
    isAdmitted: false
  },
  {
    _id: '2',
    mrn: 'MRN002',
    firstName: 'Priya',
    lastName: 'Sharma',
    dob: '1990-08-21',
    age: '33',
    gender: 'Female',
    phone: '8765432109',
    email: 'priya.sharma@example.com',
    address: '456 Park Avenue',
    city: 'Delhi',
    state: 'Delhi',
    pinCode: '110001',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    emergencyContactName: 'Rahul Sharma',
    emergencyContactRelation: 'Brother',
    emergencyContactPhone: '8765432108',
    isAdmitted: true
  },
  {
    _id: '3',
    mrn: 'MRN003',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dob: '1975-12-03',
    age: '48',
    gender: 'Male',
    phone: '7654321098',
    email: 'rajesh.kumar@example.com',
    address: '789 Lake View',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    bloodGroup: 'A-',
    maritalStatus: 'Married',
    emergencyContactName: 'Sunita Kumar',
    emergencyContactRelation: 'Wife',
    emergencyContactPhone: '7654321097',
    isAdmitted: false
  },
  {
    _id: '4',
    mrn: 'MRN004',
    firstName: 'Ananya',
    lastName: 'Patel',
    dob: '1995-03-27',
    age: '28',
    gender: 'Female',
    phone: '6543210987',
    email: 'ananya.patel@example.com',
    address: '101 Hill Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pinCode: '380001',
    bloodGroup: 'AB+',
    maritalStatus: 'Single',
    emergencyContactName: 'Nikhil Patel',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '6543210986',
    isAdmitted: false
  },
  {
    _id: '5',
    mrn: 'MRN005',
    firstName: 'Vikram',
    lastName: 'Singh',
    dob: '1980-07-14',
    age: '43',
    gender: 'Male',
    phone: '5432109876',
    email: 'vikram.singh@example.com',
    address: '202 River View',
    city: 'Chandigarh',
    state: 'Punjab',
    pinCode: '160001',
    bloodGroup: 'O-',
    maritalStatus: 'Divorced',
    emergencyContactName: 'Ravi Singh',
    emergencyContactRelation: 'Brother',
    emergencyContactPhone: '5432109875',
    isAdmitted: true
  }
];

/**
 * Get all patients
 * @returns {Array} Array of patient objects
 */
export const getAllPatients = () => {
  return mockPatients;
};

/**
 * Get patient by ID
 * @param {string} id - Patient ID
 * @returns {Object|null} Patient object or null if not found
 */
export const getPatientById = (id) => {
  return mockPatients.find(patient => patient._id === id) || null;
};

/**
 * Get patients by admission status
 * @param {boolean} isAdmitted - Admission status
 * @returns {Array} Array of patient objects
 */
export const getPatientsByAdmissionStatus = (isAdmitted) => {
  return mockPatients.filter(patient => patient.isAdmitted === isAdmitted);
};
