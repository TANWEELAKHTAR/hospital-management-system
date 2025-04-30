/**
 * Mock services data for testing
 */

export const mockServices = [
  {
    _id: '1',
    name: 'General Consultation',
    category: 'Consultation',
    description: 'General consultation with a doctor',
    duration: 30, // in minutes
    price: 500,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '2',
    name: 'Specialist Consultation',
    category: 'Consultation',
    description: 'Consultation with a specialist doctor',
    duration: 45, // in minutes
    price: 1000,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '3',
    name: 'Blood Test - Complete Blood Count',
    category: 'Laboratory',
    description: 'Complete blood count test',
    duration: 15, // in minutes
    price: 300,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '4',
    name: 'X-Ray - Chest',
    category: 'Radiology',
    description: 'Chest X-Ray',
    duration: 20, // in minutes
    price: 800,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '5',
    name: 'Ultrasound - Abdomen',
    category: 'Radiology',
    description: 'Abdominal ultrasound',
    duration: 30, // in minutes
    price: 1200,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '6',
    name: 'ECG',
    category: 'Cardiology',
    description: 'Electrocardiogram',
    duration: 15, // in minutes
    price: 500,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '7',
    name: 'Physical Therapy Session',
    category: 'Therapy',
    description: 'Physical therapy session',
    duration: 60, // in minutes
    price: 800,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '8',
    name: 'Dental Cleaning',
    category: 'Dental',
    description: 'Dental cleaning and checkup',
    duration: 45, // in minutes
    price: 700,
    isActive: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  }
];

/**
 * Get all services
 * @returns {Array} Array of service objects
 */
export const getAllServices = () => {
  return mockServices;
};

/**
 * Get service by ID
 * @param {string} id - Service ID
 * @returns {Object|null} Service object or null if not found
 */
export const getServiceById = (id) => {
  return mockServices.find(service => service._id === id) || null;
};

/**
 * Get services by category
 * @param {string} category - Service category
 * @returns {Array} Array of service objects
 */
export const getServicesByCategory = (category) => {
  return mockServices.filter(service => service.category === category);
};

/**
 * Get active services
 * @returns {Array} Array of active service objects
 */
export const getActiveServices = () => {
  return mockServices.filter(service => service.isActive);
};
