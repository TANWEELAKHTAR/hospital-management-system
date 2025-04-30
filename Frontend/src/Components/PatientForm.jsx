import React, { useState, useEffect } from 'react';

const PatientForm = ({ 
  id = 'patient-form', 
  onSubmit, 
  loading = false, 
  initialData = null,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState({
    mrn: '',
    nationalId: '',
    patientCategory: '',
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    age: '',
    gender: '',
    maritalStatus: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [errors, setErrors] = useState({});

  // If initialData is provided (for edit mode), populate the form
  useEffect(() => {
    if (initialData) {
      setFormData({
        mrn: initialData.mrn || '',
        nationalId: initialData.nationalId || '',
        patientCategory: initialData.patientCategory || '',
        title: initialData.title || '',
        firstName: initialData.firstName || '',
        middleName: initialData.middleName || '',
        lastName: initialData.lastName || '',
        dob: initialData.dob || '',
        age: initialData.age || '',
        gender: initialData.gender || '',
        maritalStatus: initialData.maritalStatus || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pinCode: initialData.pinCode || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = ['firstName', 'lastName', 'gender', 'age', 'phone', 'address'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="w-full">
      {/* Registration Info Section */}
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg">
        <h2 className="mb-4 text-xs font-medium text-gray-700 uppercase">
          REGISTRATION INFO
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              MRN {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="mrn"
              value={formData.mrn}
              onChange={handleChange}
              className={`text-xs w-full px-3 py-2 border ${errors.mrn ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              placeholder="AP250000021"
              readOnly={isEditMode} // MRN should not be editable in edit mode
              data-error={errors.mrn ? "true" : "false"}
            />
            {errors.mrn && <p className="mt-1 text-xs text-red-500">{errors.mrn}</p>}
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              National ID/IQUMA no.
            </label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="text-xs w-full px-3 py-2 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
              placeholder="23456789"
            />
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Patient category <span className="text-red-500">*</span>
            </label>
            <select 
              name="patientCategory"
              value={formData.patientCategory}
              onChange={handleChange}
              className={`text-xs w-full px-3 py-2 border ${errors.patientCategory ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              data-error={errors.patientCategory ? "true" : "false"}
            >
              <option value="">Select</option>
              <option value="Regular">Regular</option>
              <option value="Emergency">Emergency</option>
              <option value="VIP">VIP</option>
            </select>
            {errors.patientCategory && <p className="mt-1 text-xs text-red-500">{errors.patientCategory}</p>}
          </div>
        </div>
      </div>

      {/* Patient Info Section */}
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg">
        <h2 className="mb-4 text-xs font-medium text-gray-700 uppercase">
          PATIENT INFO
        </h2>
        <div className="flex mb-4">
          <div className="mr-6">
            <div className="w-24 h-24 border border-dashed border-blue-300 rounded flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="mt-1 text-xs text-blue-500">Upload</span>
              </div>
            </div>
          </div>

          <div className="flex-grow grid grid-cols-1 gap-4 md:grid-cols-4 items-end">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <select 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`text-xs w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
                data-error={errors.title ? "true" : "false"}
              >
                <option value="">Select</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
              </select>
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Given name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`text-xs w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
                placeholder="Enter"
                data-error={errors.firstName ? "true" : "false"}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Middle name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="text-xs w-full px-3 py-2 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
                placeholder="Enter"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Family name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`text-xs w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
                placeholder="Enter"
                data-error={errors.lastName ? "true" : "false"}
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Date of birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="text-xs w-full px-3 py-2 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`text-xs w-full px-3 py-2 border ${errors.age ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              placeholder="Enter"
              data-error={errors.age ? "true" : "false"}
            />
            {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`text-xs w-full px-3 py-2 border ${errors.gender ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              data-error={errors.gender ? "true" : "false"}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Marital status
            </label>
            <select 
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="text-xs w-full px-3 py-2 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`text-xs w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              placeholder="eg mail@mail.com"
              data-error={errors.email ? "true" : "false"}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`text-xs w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              placeholder="eg.0000000000"
              data-error={errors.phone ? "true" : "false"}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`text-xs w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              placeholder="Enter"
              data-error={errors.address ? "true" : "false"}
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              City/town
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="text-xs w-full px-3 py-2 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
              placeholder="Enter"
            />
          </div>
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Pin code
            </label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              className="text-xs w-full px-3 py-2 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
              placeholder="Enter"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PatientForm;
