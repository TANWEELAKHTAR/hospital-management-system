
import React, { useState, useEffect } from 'react';
import { getAllServices, getServiceById, addService, updateService, deleteService } from '../../../api/receptionService';
import { getAllPatients, getPatientById } from '../../../api/receptionService';
import ServiceList from '../../../Components/ServiceList';
import ServiceForm from '../../../Components/ServiceForm';
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function Service() {
  // State for services
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for patient search
  const [mrn, setMrn] = useState('');
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState(null);

  // State for service form
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // State for service categories
  const [selectedCategory, setSelectedCategory] = useState('');

  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch all services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Search for patient by MRN
  const searchPatient = async () => {
    if (!mrn.trim()) {
      setPatientError('Please enter an MRN');
      return;
    }

    try {
      setPatientLoading(true);
      setPatientError(null);

      // In a real app, you would search by MRN
      // For now, we'll just get the first patient from our mock data
      const patients = await getAllPatients();
      const foundPatient = patients.find(p => p.mrn === mrn);

      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        setPatientError('Patient not found');
        setPatient(null);
      }
    } catch (err) {
      console.error('Error searching for patient:', err);
      setPatientError('Failed to search for patient. Please try again.');
      setPatient(null);
    } finally {
      setPatientLoading(false);
    }
  };

  // Handle adding a new service
  const handleAddService = async (serviceData) => {
    try {
      setFormLoading(true);

      const newService = await addService(serviceData);

      // Update the services list
      setServices(prev => [...prev, newService]);

      // Show success message
      toast.success('Service added successfully!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });

      // Close the form
      setShowServiceForm(false);
      setEditingService(null);
    } catch (err) {
      console.error('Error adding service:', err);

      // Show error message
      toast.error(err.message || 'Failed to add service', {
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
    } finally {
      setFormLoading(false);
    }
  };

  // Handle editing a service
  const handleEditService = async (serviceData) => {
    try {
      setFormLoading(true);

      const updatedService = await updateService(editingService._id, serviceData);

      // Update the services list
      setServices(prev =>
        prev.map(service =>
          service._id === updatedService._id ? updatedService : service
        )
      );

      // Show success message
      toast.success('Service updated successfully!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });

      // Close the form
      setShowServiceForm(false);
      setEditingService(null);
    } catch (err) {
      console.error('Error updating service:', err);

      // Show error message
      toast.error(err.message || 'Failed to update service', {
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
    } finally {
      setFormLoading(false);
    }
  };

  // Handle deleting a service
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await deleteService(serviceId);

      // Update the services list
      setServices(prev => prev.filter(service => service._id !== serviceId));

      // Show success message
      toast.success('Service deleted successfully!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce
      });
    } catch (err) {
      console.error('Error deleting service:', err);

      // Show error message
      toast.error(err.message || 'Failed to delete service', {
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
    }
  };

  // Filter services based on search term and category
  const filteredServices = services.filter(service => {
    // First apply category filter if selected
    if (selectedCategory && service.category !== selectedCategory) {
      return false;
    }

    // Then apply search term filter
    if (!searchTerm) return true;

    return (
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get unique categories from services
  const categories = [...new Set(services.map(service => service.category))];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-lg font-bold">Services</h1>
        </div>
        <button
          onClick={() => {
            setShowServiceForm(true);
            setEditingService(null);
          }}
          className="bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white"
        >
          Add Service
        </button>
      </div>

      <div className="w-full h-full p-4 relative overflow-auto">
        {/* Patient Search Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Patient Search</h2>
          <div className="flex gap-4">
            <div className="w-1/3 relative">
              <input
                type="text"
                className="w-full px-3 py-2 pl-3 pr-10 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
                placeholder="Enter MRN"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={searchPatient}
              disabled={patientLoading}
              className={`${patientLoading ? 'bg-gray-400' : 'bg-[#0D8E83]'} px-4 py-1 text-sm rounded-lg text-white flex items-center`}
            >
              {patientLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Search
            </button>
          </div>

          {patientError && (
            <div className="mt-2 text-sm text-red-600">{patientError}</div>
          )}
        </div>

        {/* Patient Info Section */}
        {patient && (
          <div className="flex items-start gap-4 mb-6 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="w-24 h-24 overflow-hidden rounded-md">
              <img
                src="/images/person-add.svg"
                alt="Patient"
                className="w-full h-full object-cover bg-gray-100"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-800">
                  {patient.title} {patient.firstName} {patient.lastName}
                </h1>
                <span className="text-gray-500">|</span>
                <span className="text-gray-500">MRN: {patient.mrn}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm">
                <div className="flex items-center gap-1 text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{patient.dob} | {patient.age} years</span>
                </div>

                <div className="flex items-center gap-1 text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <span>{patient.gender}</span>
                </div>

                <div className="flex items-center gap-1 text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{patient.phone}</span>
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
                className="cursor-pointer mt-2 px-3 py-1 border border-[#0D8E83] bg-[#DEFCFA] rounded-md text-sm text-[#0D8E83] hover:bg-[#C5F1EE] transition-colors"
                onClick={() => {
                  // In a real app, this would open a modal to add services to the patient
                  alert('This feature would allow you to add services to the patient');
                }}
              >
                Add service to patient
              </button>
            </div>
          </div>
        )}

        {/* Services Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Services</h2>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/3 relative">
              <input
                type="text"
                className="w-full px-3 py-2 pl-3 pr-10 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <select
              className="px-3 py-2 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Services List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <ServiceList
              services={filteredServices}
              loading={loading}
              error={error}
              onEdit={(service) => {
                setEditingService(service);
                setShowServiceForm(true);
              }}
              onDelete={handleDeleteService}
              onSelect={(service) => {
                // In a real app, this would add the service to the patient
                if (patient) {
                  alert(`Service "${service.name}" would be added to patient ${patient.firstName} ${patient.lastName}`);
                } else {
                  alert('Please search for a patient first');
                }
              }}
            />
          </div>
        </div>

        {/* Service Form Modal */}
        {showServiceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ServiceForm
                id="service-form"
                onSubmit={editingService ? handleEditService : handleAddService}
                loading={formLoading}
                initialData={editingService}
                isEditMode={!!editingService}
              />

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="service-form"
                  disabled={formLoading}
                  className={`px-4 py-2 rounded-md text-white ${formLoading ? 'bg-gray-400' : 'bg-[#0D8E83] hover:bg-[#0A7A72]'}`}
                >
                  {formLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingService ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    editingService ? 'Update Service' : 'Add Service'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={false}
          theme="light"
          transition={Bounce}
        />
      </div>
    </div>
  );
}
