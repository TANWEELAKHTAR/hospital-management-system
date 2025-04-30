import React, { useState, useEffect } from 'react';

const ServiceForm = ({ 
  id = 'service-form', 
  onSubmit, 
  loading = false, 
  initialData = null,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    duration: '',
    price: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  // If initialData is provided (for edit mode), populate the form
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        description: initialData.description || '',
        duration: initialData.duration ? initialData.duration.toString() : '',
        price: initialData.price ? initialData.price.toString() : '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = ['name', 'category', 'duration', 'price'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Numeric validation for duration and price
    if (formData.duration && isNaN(Number(formData.duration))) {
      newErrors.duration = 'Duration must be a number';
    }
    
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert numeric strings to numbers
      const processedData = {
        ...formData,
        duration: Number(formData.duration),
        price: Number(formData.price)
      };
      
      onSubmit(processedData);
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
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              placeholder="Enter service name"
              data-error={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              data-error={errors.category ? "true" : "false"}
            >
              <option value="">Select Category</option>
              <option value="Consultation">Consultation</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Radiology">Radiology</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Therapy">Therapy</option>
              <option value="Dental">Dental</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D0D5DD] bg-[#F7F9FC] rounded-md"
              placeholder="Enter service description"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.duration ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              placeholder="Enter duration in minutes"
              data-error={errors.duration ? "true" : "false"}
            />
            {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-[#D0D5DD]'} bg-[#F7F9FC] rounded-md`}
              placeholder="Enter price"
              data-error={errors.price ? "true" : "false"}
            />
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
          </div>
          
          <div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-[#0D8E83] border-gray-300 rounded focus:ring-[#0D8E83]"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ServiceForm;
