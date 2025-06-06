/**
 * Mock users for testing login functionality
 * This file contains predefined users for testing different roles
 */

export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'clinicAdmin'
  },
  {
    id: 2,
    name: 'Reception Staff',
    email: 'reception@hospital.com',
    password: 'reception123',
    role: 'reception'
  },
  {
    id: 3,
    name: 'Doctor',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor'
  },
  {
    id: 4,
    name: 'Nurse',
    email: 'nurse@hospital.com',
    password: 'nurse123',
    role: 'nurse'
  },
  {
    id: 5,
    name: 'Lab Technician',
    email: 'lab@hospital.com',
    password: 'lab123',
    role: 'lab'
  },
  {
    id: 6,
    name: 'Pharmacy Staff',
    email: 'pharmacy@hospital.com',
    password: 'pharmacy123',
    role: 'pharmacy'
  }
];

/**
 * Find a user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} - User object or null if not found
 */
export const findUser = (email, password) => {
  return mockUsers.find(user => 
    user.email.toLowerCase() === email.toLowerCase() && 
    user.password === password
  ) || null;
};

/**
 * Find a user by name and password
 * @param {string} name - User name
 * @param {string} password - User password
 * @returns {Object|null} - User object or null if not found
 */
export const findUserByName = (name, password) => {
  return mockUsers.find(user => 
    user.name.toLowerCase() === name.toLowerCase() && 
    user.password === password
  ) || null;
};
