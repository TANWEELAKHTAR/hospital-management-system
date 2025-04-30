import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReferralForm = ({
  id = 'referral-form',
  onSubmit,
  loading = false,
  initialData = null,
  isEditMode = false
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    referralType: '',
    referralCode: '',
    speciality: '',
    qualification: '',
    hospitalName: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    email: '',
    phone: ''
  });

  // If initialData is provided (for edit mode), populate the form
  useEffect(() => {
    if (initialData) {
      // Split the name into first, middle, and last name
      const nameParts = initialData.name.split(' ');
      let firstName = nameParts[0] || '';
      let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      let middleName = '';

      // If there are more than 2 parts, everything in between is the middle name
      if (nameParts.length > 2) {
        middleName = nameParts.slice(1, -1).join(' ');
      }

      setFormData({
        firstName,
        middleName,
        lastName,
        referralType: initialData.referralType || '',
        referralCode: initialData.referralCode || '',
        speciality: initialData.speciality || '',
        qualification: initialData.qualification || '',
        hospitalName: initialData.hospitalName || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pinCode: initialData.pinCode || '',
        email: initialData.email || '',
        phone: initialData.phone || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.referralType || !formData.referralCode || !formData.address || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate email format if provided
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError(null);

    try {
      // Prepare data for API
      const referralData = {
        name: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`,
        referralType: formData.referralType,
        referralCode: formData.referralCode,
        speciality: formData.speciality || '',
        qualification: formData.qualification || '',
        hospitalName: formData.hospitalName || '',
        address: formData.address,
        city: formData.city || '',
        state: formData.state || '',
        pinCode: formData.pinCode || '',
        email: formData.email || '',
        phone: formData.phone
      };

      // Call the onSubmit callback provided by parent component
      if (onSubmit) {
        onSubmit(referralData);
      } else {
        // Fallback to navigate if no callback provided
        navigate('/reception/referral');
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      setError(err.message || 'Form submission failed. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form id={id} onSubmit={handleSubmit} className="space-y-6" disabled={loading}>

        <div className="border border-[#D0D5DD] rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-gray-700 font-medium uppercase text-sm mb-4">Referral Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-sm">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">Middle name</label>
              <input
                type="text"
                placeholder="Enter"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">
                Referral type <span className="text-red-500">*</span>
              </label>
              <select
                name="referralType"
                value={formData.referralType}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
                required
              >
                <option value="">Select</option>
                <option value="Doctor">Doctor</option>
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm">
                Referral code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">Speciality</label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
              >
                <option value="">Select</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="ENT">ENT</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Urology">Urology</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="General Medicine">General Medicine</option>
                <option value="General Surgery">General Surgery</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm">Qualification</label>
              <input
                type="text"
                placeholder="Enter"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">Hospital/clinic name</label>
              <input
                type="text"
                placeholder="Enter"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
              />
            </div>
          </div>
        </div>
        <div className="border border-[#D0D5DD] rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-gray-700 font-medium uppercase text-sm mb-4">Contact Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 space-y-1">
              <label className="block text-sm">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">City</label>
              <input
                type="text"
                placeholder="Enter"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
              >
                <option value="">Select</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm">Pin code</label>
              <input
                type="text"
                placeholder="Enter"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">Email</label>
              <input
                type="email"
                name="email"
                placeholder='Enter'
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder='Enter'
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-[#D0D5DD] bg-[#F7F9FC] rounded p-2 text-sm"
                required
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReferralForm;