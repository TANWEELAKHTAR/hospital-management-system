import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PatientProfile from "../../../Components/PatientProfile";
import { getPatientById } from "../../../api/receptionService";

export default function PatientRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPatientData();
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

  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <div className="flex gap-2 items-center">
          <Link to={"/reception/patient-master"}><img src="/images/Back.svg" alt="Back" /></Link>
          <h1 className="text-lg font-bold">
            {loading ? 'Loading...' : error ? 'Patient Record' : `${patient?.firstName || ''} ${patient?.lastName || ''}`}
          </h1>
        </div>
        <div className="flex gap-4">
          <Link
            to={`/reception/admit-patient/${id}`}
            className='cursor-pointer px-4 py-1 text-sm rounded-lg border border-[#0D8E83] bg-[#DEFCFA] text-[#0D8E83]'
          >
            Admit patient
          </Link>
          <Link
            to={`/reception/book-appointment/${id}`}
            className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
          >
            Book Appointment
          </Link>
        </div>
      </div>
      <div className="h-full p-4 bg-[#FDFDFE]">
        <PatientProfile patientId={id} />
      </div>
    </div>
  );
}