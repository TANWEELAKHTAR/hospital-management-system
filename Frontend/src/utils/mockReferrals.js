/**
 * Mock referrals data for testing
 */

export const mockReferrals = [
  {
    _id: '1',
    name: 'Dr. Rajesh Kumar',
    referralType: 'Doctor',
    referralCode: 'REF001',
    speciality: 'Cardiology',
    qualification: 'MD, DM',
    hospitalName: 'City Heart Hospital',
    address: '123 Medical Lane, Sector 10',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    email: 'dr.rajesh@cityheart.com',
    phone: '9876543210',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    _id: '2',
    name: 'Dr. Priya Sharma',
    referralType: 'Doctor',
    referralCode: 'REF002',
    speciality: 'Neurology',
    qualification: 'MBBS, MD',
    hospitalName: 'Brain & Spine Center',
    address: '456 Health Avenue, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411001',
    email: 'dr.priya@brainspine.com',
    phone: '8765432109',
    createdAt: '2023-06-10T14:15:00Z',
    updatedAt: '2023-06-10T14:15:00Z'
  },
  {
    _id: '3',
    name: 'Apollo Hospitals',
    referralType: 'Hospital',
    referralCode: 'REF003',
    speciality: '',
    qualification: '',
    hospitalName: 'Apollo Hospitals',
    address: '789 Healthcare Road, Greams Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pinCode: '600006',
    email: 'referrals@apollohospitals.com',
    phone: '7654321098',
    createdAt: '2023-07-05T09:45:00Z',
    updatedAt: '2023-07-05T09:45:00Z'
  },
  {
    _id: '4',
    name: 'Dr. Vikram Singh',
    referralType: 'Doctor',
    referralCode: 'REF004',
    speciality: 'Orthopedics',
    qualification: 'MS Ortho',
    hospitalName: 'Joint Care Clinic',
    address: '101 Bone Street, Civil Lines',
    city: 'Delhi',
    state: 'Delhi',
    pinCode: '110054',
    email: 'dr.vikram@jointcare.com',
    phone: '6543210987',
    createdAt: '2023-08-20T11:20:00Z',
    updatedAt: '2023-08-20T11:20:00Z'
  },
  {
    _id: '5',
    name: 'Wellness Diagnostics',
    referralType: 'Clinic',
    referralCode: 'REF005',
    speciality: '',
    qualification: '',
    hospitalName: 'Wellness Diagnostics Center',
    address: '202 Health Park, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    email: 'info@wellnessdiagnostics.com',
    phone: '5432109876',
    createdAt: '2023-09-15T16:30:00Z',
    updatedAt: '2023-09-15T16:30:00Z'
  }
];

/**
 * Get all referrals
 * @returns {Array} Array of referral objects
 */
export const getAllReferrals = () => {
  return mockReferrals;
};

/**
 * Get referral by ID
 * @param {string} id - Referral ID
 * @returns {Object|null} Referral object or null if not found
 */
export const getReferralById = (id) => {
  return mockReferrals.find(referral => referral._id === id) || null;
};

/**
 * Get referrals by type
 * @param {string} type - Referral type (Doctor, Hospital, Clinic, Other)
 * @returns {Array} Array of referral objects
 */
export const getReferralsByType = (type) => {
  return mockReferrals.filter(referral => referral.referralType === type);
};

/**
 * Get referrals by speciality
 * @param {string} speciality - Medical speciality
 * @returns {Array} Array of referral objects
 */
export const getReferralsBySpeciality = (speciality) => {
  return mockReferrals.filter(referral => referral.speciality === speciality);
};
