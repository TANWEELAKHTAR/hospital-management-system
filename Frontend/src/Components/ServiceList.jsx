import React from 'react';

const ServiceList = ({ 
  services, 
  onEdit, 
  onDelete, 
  onSelect,
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

  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
        <img src="/images/EmptyDocuments.png" alt="No services" className="w-16 h-16 mb-4" />
        <p className="text-gray-500">No services found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-[#DEFCFA] text-gray-700 text-sm">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Category</th>
            <th className="py-2 px-4 text-left">Duration</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{service.name}</td>
              <td className="py-2 px-4">{service.category}</td>
              <td className="py-2 px-4">{service.duration} min</td>
              <td className="py-2 px-4">₹{service.price}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  {onSelect && (
                    <button
                      onClick={() => onSelect(service)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Select
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(service)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(service._id)}
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

export default ServiceList;
