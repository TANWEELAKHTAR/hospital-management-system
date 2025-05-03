export default function ViewMaterialDrug({ medication }) {
    const medicationData = medication || {
        name: 'Dolo 500mg',
        molecule: 'Paracetamol',
        manufacturer: 'MedCare',
        category: 'Pain Relief',
        schedule: 'H',
        hsnCode: '3010',
        packaging: 'Strips',
        weightVolume: '10 tablets',
        gst: '18%',
        mrp: '100.00'
      };
  return (
    <div className="w-full h-full flex bg-white flex-col">
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
      <h1 className="text-lg font-bold">View Material/Drug</h1>
      <div className="flex gap-4">
        <button
          className='cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white'
        >
          Edit
        </button>
      </div>
    </div>
    <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">
    <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wider">GENERAL INFO</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">Name</p>
            <p className="font-medium">{medicationData.name}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">Molecule/API</p>
            <p className="font-medium">{medicationData.molecule}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">Manufacturer</p>
            <p className="font-medium">{medicationData.manufacturer}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">Category</p>
            <p className="font-medium">{medicationData.category}</p>
          </div>
        </div>
      </div>

      {/* Regulatory & Classification Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wider">REGULATORY & CLASSIFICATION</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">Schedule</p>
            <p className="font-medium">{medicationData.schedule}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">HSN Code</p>
            <p className="font-medium">{medicationData.hsnCode}</p>
          </div>
        </div>
      </div>

      {/* Packaging & Measurement Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wider">PACKAGING & MEASUREMENT</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">Packaging</p>
            <p className="font-medium">{medicationData.packaging}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">Weight/volume</p>
            <p className="font-medium">{medicationData.weightVolume}</p>
          </div>
        </div>
      </div>

      {/* Financial & Taxation Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wider">FINANCIAL & TAXATION</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">GST%</p>
            <p className="font-medium">{medicationData.gst}</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">MRP</p>
            <p className="font-medium">₹{medicationData.mrp}</p>
          </div>
        </div>
      </div>
    </div>

    </div>
  )
}