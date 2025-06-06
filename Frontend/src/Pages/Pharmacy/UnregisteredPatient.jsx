import { useState } from 'react';

export default function UnregisteredPatient() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Select',
    phoneNumber: '',
    doctorName: '',
    drugMaterial: 'Select',
    batchNumber: '',
    qty: '',
    expiryDate: '',
    discPercentage: ''
  });

  const [drugs, setDrugs] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddDrug = () => {
    if (formData.drugMaterial !== 'Select' && formData.qty && formData.batchNumber) {
      const newDrug = {
        id: Date.now(),
        drug: formData.drugMaterial,
        qty: formData.qty,
        batchNumber: formData.batchNumber,
        expDate: formData.expiryDate,
        mrp: '100.00',
        disc: formData.discPercentage || '0',
        gst: '18',
        amount: (parseFloat(formData.qty) * 100 * (1 - parseFloat(formData.discPercentage || 0) / 100) * 1.18).toFixed(2)
      };
      setDrugs(prev => [...prev, newDrug]);
      
      // Reset drug form fields
      setFormData(prev => ({
        ...prev,
        drugMaterial: 'Select',
        batchNumber: '',
        qty: '',
        expiryDate: '',
        discPercentage: ''
      }));
    }
  };

  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      drugMaterial: 'Select',
      batchNumber: '',
      qty: '',
      expiryDate: '',
      discPercentage: ''
    }));
  };

  const totalItems = drugs.length;
  const totalAmount = drugs.reduce((sum, drug) => sum + parseFloat(drug.amount), 0).toFixed(2);

  return (
    <div className="w-full h-full flex bg-white flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Unregistered Patient</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 bg-[#FDFDFE] overflow-auto">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Patient Detail Section */}
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                PATIENT DETAIL
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Age</label>
                  <input
                    type="text"
                    placeholder="Enter"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Sex</label>
                  <div className="relative">
                    <select
                      value={formData.sex}
                      onChange={(e) => handleInputChange('sex', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
                    >
                      <option>Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Doctor's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ready for Billing Section */}
          <div className="border border-gray-200 rounded-lg bg-white">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                READY FOR BILLING
              </h3>
            </div>
            
            <div className="p-6">
              {/* Search & Add Drugs Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-4 uppercase tracking-wide">
                  SEARCH & ADD DRUGS
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Drug/material <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.drugMaterial}
                        onChange={(e) => handleInputChange('drugMaterial', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
                      >
                        <option>Select</option>
                        <option>Paracetamol</option>
                        <option>Aspirin</option>
                        <option>Ibuprofen</option>
                        <option>Amoxicillin</option>
                        <option>Omeprazole</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none">
                        🔍
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Batch Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter"
                      value={formData.batchNumber}
                      onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      QTY <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter"
                      value={formData.qty}
                      onChange={(e) => handleInputChange('qty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Expiry date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YYYY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Disc %
                    </label>
                    <input
                      type="number"
                      placeholder="Enter"
                      value={formData.discPercentage}
                      onChange={(e) => handleInputChange('discPercentage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter quantity & packaging to check qty available for dispatch"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddDrug}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Drug Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-cyan-50 border-b border-gray-200">
                  <div className="grid grid-cols-8 gap-4 px-4 py-3">
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">DRUG</div>
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">QTY</div>
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">BATCH NUMBER</div>
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">EXP DATE</div>
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">MRP(₹)</div>
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">DISC %</div>
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">GST%</div>
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">AMOUNT (₹)</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {drugs.length > 0 ? (
                    drugs.map((drug) => (
                      <div key={drug.id} className="grid grid-cols-8 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="text-sm text-gray-900">{drug.drug}</div>
                        <div className="text-sm text-gray-900">{drug.qty}</div>
                        <div className="text-sm text-gray-900">{drug.batchNumber}</div>
                        <div className="text-sm text-gray-900">{drug.expDate}</div>
                        <div className="text-sm text-gray-900">₹{drug.mrp}</div>
                        <div className="text-sm text-gray-900">{drug.disc}%</div>
                        <div className="text-sm text-gray-900">{drug.gst}%</div>
                        <div className="text-sm text-gray-900">₹{drug.amount}</div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-6">
                      <div className="relative mb-4">
                        <div className="w-12 h-16 bg-white border-2 border-teal-400 rounded-lg relative">
                          <div className="space-y-1 p-2">
                            <div className="h-0.5 bg-teal-400 rounded w-6"></div>
                            <div className="h-0.5 bg-teal-400 rounded w-4"></div>
                            <div className="h-0.5 bg-teal-400 rounded w-5"></div>
                            <div className="h-0.5 bg-teal-400 rounded w-3"></div>
                          </div>
                        </div>
                        <div className="absolute -right-1 -top-1 w-12 h-16 bg-white border-2 border-teal-400 rounded-lg -z-10"></div>
                      </div>
                      <p className="text-gray-500 text-sm mb-8">Add drug/medicine to see here</p>
                    </div>
                  )}
                </div>

                {/* Total Section */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex justify-end gap-8 text-sm">
                    <div className="text-gray-600">
                      Total Items: <span className="font-medium text-gray-900">{totalItems.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="text-gray-600">
                      Total Amount: <span className="font-medium text-gray-900">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
