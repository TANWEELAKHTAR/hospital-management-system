  import { useState } from 'react';
  import { Search, Filter } from 'lucide-react';

  export default function OPPrescription() {
    const [searchTerm, setSearchTerm] = useState('');

    const prescriptions = [
      { id: '1234567', name: 'Arrav Sharma', age: '25Y', gender: 'Male', prescribedBy: 'Dr Raj Kumar', date: '27/01/2025' },
      { id: '9876543', name: 'Priya Desai', age: '54Y', gender: 'Female', prescribedBy: 'Dr Someshwar Rao', date: '25/01/2025' },
      { id: '3456786', name: 'Rohan Patel', age: '98Y', gender: 'Male', prescribedBy: 'Dr Anjali Mehta', date: '22/12/2024' },
      { id: '8765432', name: 'Ananya Gupta', age: '32Y', gender: 'Male', prescribedBy: 'Dr Priya Patel', date: '10/12/2024' },
      { id: '4567890', name: 'Vikram Singh', age: '76Y', gender: 'Male', prescribedBy: 'Dr Sanjay Sharma', date: '15/01/2025' },
      { id: '0987654', name: 'Nisha Mehta', age: '44Y', gender: 'Male', prescribedBy: 'Dr Nisha Gupta', date: '05/01/2025' },
      { id: '5678901', name: 'Sonia Choudhary', age: '21Y', gender: 'Female', prescribedBy: 'Dr Rohit Singh', date: '30/11/2024' },
      { id: '2345678', name: 'Aarav Kumar', age: '63Y', gender: 'Male', prescribedBy: 'Dr Pooja Verma', date: '20/11/2024' },
      { id: '6543210', name: 'Jiya Verma', age: '89Y', gender: 'Male', prescribedBy: 'Dr Manoj Kumar', date: '10/11/2024' },
      { id: '7654321', name: 'Rajat Kapoor', age: '70Y', gender: 'Female', prescribedBy: 'Dr Sneha Reddy', date: '31/10/2024' },
      { id: '2109876', name: 'Ishaan Khanna', age: '12Y', gender: 'Male', prescribedBy: 'Dr Siddharth Jain', date: '21/10/2024' },
      { id: '3210987', name: 'Mira Shah', age: '57Y', gender: 'Male', prescribedBy: 'Dr Divya Mishra', date: '11/10/2024' },
      { id: '8901234', name: 'Aisha Bhatia', age: '30Y', gender: 'Male', prescribedBy: 'Dr Arjun Malhotra', date: '01/10/2024' },
      { id: '7890123', name: 'Pooja Rao', age: '68Y', gender: 'Female', prescribedBy: 'Dr Kavita Sharma', date: '21/09/2024' },
      { id: '4321098', name: 'Pooja Rao', age: '42Y', gender: 'Female', prescribedBy: 'Dr Sunil Verma', date: '11/09/2024' },
      { id: '5432109', name: 'Pooja Rao', age: '42Y', gender: 'Male', prescribedBy: 'Dr Meenakshi Singh', date: '11/09/2024' }
    ];

    const filteredPrescriptions = prescriptions.filter(prescription =>
      prescription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.includes(searchTerm) ||
      prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="w-full h-full flex bg-white flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
          <h1 className="text-lg font-bold">OP Prescription</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 bg-[#FDFDFE]">
          <div className="w-full max-w-6xl mx-auto">
            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by patient name, prescription ID, or doctor"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Table Container */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* Table Header */}
              <div className="bg-cyan-50 border-b border-gray-200">
                <div className="grid grid-cols-6 gap-4 px-6 py-3">
                  <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    PRESCRIPTION ID
                  </div>
                  <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    PATIENT NAME
                  </div>
                  <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    AGE
                  </div>
                  <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    GENDER
                  </div>
                  <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    PRESCRIBED BY
                  </div>
                  <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    DATE OF PRESCRIPTION
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="text-sm text-gray-900">{prescription.id}</div>
                      <div className="text-sm text-gray-900">{prescription.name}</div>
                      <div className="text-sm text-gray-900">{prescription.age}</div>
                      <div className="text-sm text-gray-900">{prescription.gender}</div>
                      <div className="text-sm text-gray-900">{prescription.prescribedBy}</div>
                      <div className="text-sm text-gray-900">{prescription.date}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <img className='h-16' src="/images/EmptyDocuments.png" alt="No results" />
                      <p className="text-gray-500 mt-4">No prescriptions found</p>
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }