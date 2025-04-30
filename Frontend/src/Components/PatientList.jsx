import React from 'react';
import { Link } from 'react-router-dom';

const PatientList = ({ 
  patients, 
  onEdit, 
  onDelete, 
  onView,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D8E83]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
        <img src="/images/EmptyDocuments.png" alt="No patients" className="w-16 h-16 mb-4" />
        <p className="text-gray-500">No patients found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-[#DEFCFA] text-gray-700 text-xs">
            <th className="py-2 px-4 text-left">MRN</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Age/Gender</th>
            <th className="py-2 px-4 text-left">Phone</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Address</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id} className="border-b hover:bg-gray-50 text-xs">
              <td className="py-2 px-4">{patient.mrn}</td>
              <td className="py-2 px-4">
                {patient.title} {patient.firstName} {patient.middleName ? patient.middleName + ' ' : ''}{patient.lastName}
              </td>
              <td className="py-2 px-4">{patient.age} / {patient.gender}</td>
              <td className="py-2 px-4">{patient.phone}</td>
              <td className="py-2 px-4">{patient.email || '-'}</td>
              <td className="py-2 px-4">
                {patient.address}
                {patient.city && `, ${patient.city}`}
                {patient.pinCode && ` - ${patient.pinCode}`}
              </td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${patient.isAdmitted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {patient.isAdmitted ? 'Admitted' : 'Registered'}
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  {onView && (
                    <button
                      onClick={() => onView(patient._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(patient._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(patient._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
