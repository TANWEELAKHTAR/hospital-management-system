import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPatients } from '../api/receptionService';

const PatientTable = ({ searchTerm = '', mrnSearch = '', patientType = 'outpatient' }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await getAllPatients();
      if (response && Array.isArray(response)) {
        setPatients(response);
      } else {
        // If the response is not an array, initialize with empty array
        setPatients([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients. Please try again.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search terms and patient type
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // Filter by patient type
      if (patientType === 'inpatient' && !patient.isAdmitted) {
        return false;
      }
      if (patientType === 'outpatient' && patient.isAdmitted) {
        return false;
      }

      // Filter by name search
      const nameMatch = !searchTerm ||
        (patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter by MRN search
      const mrnMatch = !mrnSearch ||
        (patient.mrn && patient.mrn.toLowerCase().includes(mrnSearch.toLowerCase()));

      return nameMatch && mrnMatch;
    });
  }, [patients, searchTerm, mrnSearch, patientType]);

  return (
    <div className="rounded-lg h-3/4 overflow-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D8E83]"></div>
        </div>
      ) : filteredPatients.length > 0 ? (
        <table className="w-full bg-white rounded-lg">
          <thead className="bg-[#DEFCFA]">
            <tr>
              <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MRN</th>
              <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NAME</th>
              <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">AGE</th>
              <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">GENDER</th>
              <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PHONE NUMBER</th>
              <th className="px-6 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ACTION</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredPatients.map((patient, index) => (
              <tr key={patient._id || index} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{patient.mrn || 'N/A'}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
                  <Link to={`/reception/patient-record/${patient._id}`}>{patient.firstName} {patient.lastName}</Link>
                </td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{patient.age || 'N/A'}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{patient.gender || 'N/A'}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{patient.phone || 'N/A'}</td>
                <td className="px-6 py-2 whitespace-nowrap text-sm">
                  <div className="flex space-x-2 items-center">
                    <Link
                      to={`/reception/book-appointment/${patient._id}`}
                      className="px-3 py-1 rounded text-[#0D8E83]"
                    >
                      Appointment
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to={`/reception/admit-patient/${patient._id}`}
                      className="px-3 py-1 text-[#0D8E83] rounded"
                    >
                      Admission
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
          <img src="/images/EmptyDocuments.png" alt="No patients" className="w-16 h-16 mb-4" />
          <p className="text-gray-500">No patients found</p>
          <Link to="/reception/new-patient-registration" className="mt-4 px-4 py-2 bg-[#0D8E83] text-white rounded-lg text-sm">
            Register New Patient
          </Link>
        </div>
      )}
    </div>
  );
};

export default PatientTable;