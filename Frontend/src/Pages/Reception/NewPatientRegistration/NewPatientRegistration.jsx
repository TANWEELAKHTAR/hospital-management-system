import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import PatientForm from "../../../Components/PatientForm";
import { newPatientRegistration } from "../../../api/receptionService";

const NewPatientRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Map form data to API format
  const mapFormDataToApi = (formData) => {
    return {
      mrn: formData.mrn,
      iquma: formData.nationalId,
      patientCategory: formData.patientCategory,
      title: formData.title,
      givenName: formData.firstName,
      middleName: formData.middleName,
      familyName: formData.lastName,
      dateOfBirth: formData.dob,
      age: formData.age,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode
    };
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      // Map form data to API format
      const patientData = mapFormDataToApi(formData);

      // Call API to register new patient
      const response = await newPatientRegistration(patientData);
      console.log('Patient registered successfully:', response);

      // Show success toast
      toast.success("Patient added successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        onClose: () => {
          // Navigate to patient master after toast closes
          navigate('/reception/patient-master');
        }
      });

      return response; // Return response for chaining
    } catch (err) {
      console.error('Error registering patient:', err);

      // Show error toast
      toast.error(err.message || 'Failed to register patient', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });

      throw err; // Re-throw for error handling
    } finally {
      setLoading(false);
    }
  };

  // Handle "Add & continue to schedule" action
  const handleAddAndSchedule = async (patientData) => {
    try {
      await handleSubmit(patientData);
      // If successful, navigate to scheduling
      navigate('/reception/book-appointment');
    } catch (err) {
      console.error('Error in handleAddAndSchedule:', err);
    }
  };

  return (
    <div className="w-full h-full flex bg-white flex-col overflow-auto">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Patient Master</h1>
        <div className="">
          <Link
            to="/reception/patient-master"
            className="px-2 py-1 border border-[#D0D5DD] bg-[#F0F2F5] text-sm rounded-lg"
          >
            Cancel
          </Link>
          <button
            onClick={handleAddAndSchedule}
            className="px-2 py-1 border border-[#0D8E83] bg-[#DEFCFA] text-[#0D8E83] text-sm rounded-lg mx-2"
          >
            Add & continue to schedule
          </button>
        </div>
      </div>

      <div className="w-full p-4 mx-auto">
        <PatientForm
          id="patient-form"
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default NewPatientRegistration;
