import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPatientById } from '../../../api/receptionService';
import { getPatientMedicalHistory, saveMedicalForm } from '../../../api/doctorService';

export default function MedicalForm() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPatientData();
      fetchMedicalHistory();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const data = await getPatientById(id);
      setPatient(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError("Failed to load patient information.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalHistory = async () => {
    try {
      const data = await getPatientMedicalHistory(id);
      setMedicalHistory(data);
    } catch (err) {
      console.error("Error fetching medical history:", err);
      // We don't set error here as it's not critical
    }
  };

  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    spo2: '',
    height: '',
    weight: '',
    bmi: ''
  });

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;

    // Calculate BMI if height and weight are available
    if (name === 'height' || name === 'weight') {
      const newVitals = {
        ...vitals,
        [name]: value
      };

      const height = name === 'height' ? parseFloat(value) : parseFloat(vitals.height);
      const weight = name === 'weight' ? parseFloat(value) : parseFloat(vitals.weight);

      if (!isNaN(height) && !isNaN(weight) && height > 0) {
        // BMI = weight(kg) / (height(m))²
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        newVitals.bmi = bmi;
      }

      setVitals(newVitals);
    } else {
      setVitals(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const [medicalSections, setMedicalSections] = useState({
    Allergies: false,
    FamilyHistory: false,
    SurgicalHistory: false,
    SocialHistory: false,
  });

  const toggleSection = (section) => {
    setMedicalSections({
      ...medicalSections,
      [section]: !medicalSections[section],
    });
  };
  return (
    <div className="w-full h-full  flex bg-white flex-col">
    <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
      <div className="flex gap-2 items-center">
        <Link to={"/doctor/op-queue"}><img src="/images/Back.svg" alt="Back" /></Link>
        <h1 className="text-lg font-bold">
          {loading ? 'Loading...' : error ? 'Patient Record' : `${patient?.firstName || ''} ${patient?.lastName || ''}`}
        </h1>
      </div>
      <button
        onClick={() => {
          // Handle save and print functionality
          alert('Save and print functionality will be implemented soon');
        }}
        className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
      >
        Save & Print
      </button>
    </div>

    {loading ? (
      <div className="p-2 w-full bg-[#1D2739] text-[#D0D5DD] text-sm flex justify-center">
        <div className="animate-pulse">Loading patient information...</div>
      </div>
    ) : error ? (
      <div className="p-2 w-full bg-[#1D2739] text-[#D0D5DD] text-sm">
        <div className="text-red-400">{error}</div>
      </div>
    ) : (
      <div className="p-2 w-full bg-[#1D2739] text-[#D0D5DD] text-sm">
        <ul className='flex flex-wrap gap-3 list-disc list-inside'>
          <li>MRN: {patient?.mrn || patient?._id || 'N/A'}</li>
          <li>DOB: {patient?.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</li>
          <li>AGE: {patient?.age || (patient?.dob ? `${new Date().getFullYear() - new Date(patient.dob).getFullYear()}Y` : 'N/A')}</li>
          <li>PHONE: {patient?.phone || 'N/A'}</li>
          {patient?.email && <li>EMAIL: {patient.email}</li>}
          <li>
            <Link to={`/reception/patient-record/${id}`} className='text-[#0D8E83]'>
              Open patient record<span><img className='inline ml-1' src="/images/arrow.svg" alt="" /></span>
            </Link>
          </li>
        </ul>
      </div>
    )}
    <div className="h-full p-4 bg-[#FDFDFE] overflow-auto">
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <form>
        {/* Vitals Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Vitals</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Blood Pressure</label>
              <input
                type="text"
                name="bloodPressure"
                placeholder="Enter mmHg"
                value={vitals.bloodPressure}
                onChange={handleVitalsChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Heart Rate</label>
              <input
                type="text"
                name="heartRate"
                placeholder="Enter bpm"
                value={vitals.heartRate}
                onChange={handleVitalsChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Temperature</label>
              <input
                type="text"
                name="temperature"
                placeholder="Enter °F"
                value={vitals.temperature}
                onChange={handleVitalsChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">SPO2</label>
              <input
                type="text"
                name="spo2"
                placeholder="Enter % on room air"
                value={vitals.spo2}
                onChange={handleVitalsChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Height</label>
              <input
                type="text"
                name="height"
                placeholder="Enter cm"
                value={vitals.height}
                onChange={handleVitalsChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Weight</label>
              <input
                type="text"
                name="weight"
                placeholder="Enter kg"
                value={vitals.weight}
                onChange={handleVitalsChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">BMI</label>
              <input
                type="text"
                name="bmi"
                placeholder="kg/m²"
                value={vitals.bmi}
                onChange={handleVitalsChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>
        {/* Symptoms & Concern Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Symptoms & Concern</h2>
          <textarea
            placeholder="Enter symptoms and concerns"
            rows={"3"}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        {/* Medical History Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">Medical History</h2>
          <div className="mb-4 border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection("Allergies")}
            className="flex items-center gap-2 w-full p-3 text-left bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${
                medicalSections.Allergies ? "rotate-0" : "-rotate-90"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">
            ALLERGIES
            </span>
          </button>
          {medicalSections.payerDetails && (
            <p className="text-xs text-gray-500">Payer details content</p>
        )}
        </div>
          <div className="mb-4 border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection("FamilyHistory")}
            className="flex items-center gap-2 w-full p-3 text-left bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${
                medicalSections.FamilyHistory ? "rotate-0" : "-rotate-90"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">
            FAMILY HISTORY
            </span>
          </button>
          {medicalSections.payerDetails && (
            <p className="text-xs text-gray-500">Payer details content</p>
        )}
        </div>
          <div className="mb-4 border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection("SurgicalHistory")}
            className="flex items-center gap-2 w-full p-3 text-left bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${
                medicalSections.SurgicalHistory ? "rotate-0" : "-rotate-90"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">
            SURGICAL HISTORY
            </span>
          </button>
          {medicalSections.payerDetails && (
            <p className="text-xs text-gray-500">Payer details content</p>
        )}
        </div>
          <div className="mb-4 border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection("SocialHistory")}
            className="flex items-center gap-2 w-full p-3 text-left bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${
                medicalSections.SocialHistory ? "rotate-0" : "-rotate-90"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">
              SOCIAL HISTORY
            </span>
          </button>
          {medicalSections.payerDetails && (
            <p className="text-xs text-gray-500">Payer details content</p>
        )}
        </div>
        </div>

        {/* Examination & Diagnosis Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">Examination & Diagnosis</h2>
          <div className="space-y-4">
            <textarea
              placeholder="Examination note"
              rows={"3"}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="ICD code"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Diagnosis"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              placeholder="Note"
              rows={"3"}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Prescription Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Prescription</h2>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="Type to search for medication"
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-[#D0D5DD] text-white rounded-md hover:bg-blue-600 transition">Add</button>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center p-6">
            <img className='h-16' src="/images/EmptyDocuments.png" alt="" />
            <p className="text-gray-500">Search to add medications</p>
          </div>
        </div>

        {/* Lab Tests Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Lab Tests</h2>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="Type to search for tests"
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-[#D0D5DD] text-white rounded-md hover:bg-blue-600 transition">Add</button>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center p-6">
            <img className='h-16' src="/images/EmptyDocuments.png" alt="" />
            <p className="text-gray-500">Search to add tests</p>
          </div>
        </div>

        {/* Advice Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Advice</h2>
          <textarea
            placeholder="Enter advice"
            rows={"2"}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Revisit Date Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Revisit Date</h2>
          <select
            className="w-fit px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Revisit After</option>
          </select>
        </div>
      </form>
    </div>
    </div>
  </div>

  );
}