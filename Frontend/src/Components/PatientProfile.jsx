import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPatientById } from '../api/receptionService';

const PatientProfile = ({ patientId }) => {
  const [expandedSections, setExpandedSections] = useState({
    additionalDetails: false,
    payerDetails: false,
    nextToKinDetails: false
  });
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get patientId from props or from URL params
  const { id } = useParams();
  const patientIdToUse = patientId || id;

  useEffect(() => {
    fetchPatientData();
  }, [patientIdToUse]);

  const fetchPatientData = async () => {
    if (!patientIdToUse) {
      setError("Patient ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getPatientById(patientIdToUse);
      setPatient(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError("Failed to load patient information. Please try again.");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return `${age} Y`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="w-full mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D8E83]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={fetchPatientData}
            className="mt-2 px-3 py-1 bg-red-200 rounded-md text-sm text-red-700 hover:bg-red-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="w-full mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">No patient data found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-24 h-24 overflow-hidden rounded-md">
          <img
            src={patient.profileImage || "/images/default-avatar.png"}
            alt={`${patient.firstName} ${patient.lastName}`}
            className="w-full h-full object-cover bg-gray-200"
            onError={(e) => {
              e.target.src = "/images/default-avatar.png";
            }}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {patient.title || ''} {patient.firstName || ''} {patient.lastName || ''}
            </h1>
            <span className="text-gray-500">|</span>
            <span className="text-gray-500">MRN: {patient.mrn || patient._id || 'N/A'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm">
            <div className="flex items-center gap-1 text-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formatDate(patient.dob)} | {patient.age || calculateAge(patient.dob)}</span>
            </div>

            <div className="flex items-center gap-1 text-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <span>{patient.gender || 'N/A'}</span>
            </div>

            <div className="flex items-center gap-1 text-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{patient.phone || 'N/A'}</span>
            </div>

            {patient.email && (
              <div className="flex items-center gap-1 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>{patient.email}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => alert('Edit functionality will be implemented soon')}
            className="mt-2 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-600">PATIENT INFO</h2>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Family name</h3>
              <p className="text-gray-800">{patient.familyName || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Grandfather name</h3>
              <p className="text-gray-800">{patient.grandfatherName || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Marital status</h3>
              <p className="text-gray-800">{patient.maritalStatus || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-600">ADDRESS</h2>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Address</h3>
              <p className="text-gray-800">{patient.address || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">City</h3>
              <p className="text-gray-800">{patient.city || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">State</h3>
              <p className="text-gray-800">{patient.state || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-1">Pin Code</h3>
              <p className="text-gray-800">{patient.pinCode || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Collapsible sections */}
        <button
          onClick={() => toggleSection('additionalDetails')}
          className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-600">ADDITIONAL DETAILS</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-gray-400 transition-transform ${expandedSections.additionalDetails ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {expandedSections.additionalDetails && (
          <div className="border border-gray-200 rounded-lg overflow-hidden p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Blood Group</h3>
                <p className="text-gray-800">{patient.bloodGroup || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Occupation</h3>
                <p className="text-gray-800">{patient.occupation || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Nationality</h3>
                <p className="text-gray-800">{patient.nationality || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => toggleSection('payerDetails')}
          className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-600">PAYER DETAILS</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-gray-400 transition-transform ${expandedSections.payerDetails ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {expandedSections.payerDetails && (
          <div className="border border-gray-200 rounded-lg overflow-hidden p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Insurance Provider</h3>
                <p className="text-gray-800">{patient.insuranceProvider || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Insurance ID</h3>
                <p className="text-gray-800">{patient.insuranceId || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Insurance Validity</h3>
                <p className="text-gray-800">{patient.insuranceValidity ? formatDate(patient.insuranceValidity) : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => toggleSection('nextToKinDetails')}
          className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-600">NEXT TO KIN DETAILS</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-gray-400 transition-transform ${expandedSections.nextToKinDetails ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {expandedSections.nextToKinDetails && (
          <div className="border border-gray-200 rounded-lg overflow-hidden p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Name</h3>
                <p className="text-gray-800">{patient.emergencyContactName || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Relationship</h3>
                <p className="text-gray-800">{patient.emergencyContactRelation || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Phone</h3>
                <p className="text-gray-800">{patient.emergencyContactPhone || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;