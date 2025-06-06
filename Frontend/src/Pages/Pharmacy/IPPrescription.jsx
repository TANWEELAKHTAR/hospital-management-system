import { useState } from 'react';

export default function IPPrescription() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ipSearchTerm, setIpSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const patientData = [
    { mrn: '12345432343', ipNumber: '12345432343', name: 'Arrav Sharma', age: '25Y', gender: 'Male', admittedBy: 'Dr. Arnav Sharma', bed: 'Room 11 - Bed 4' },
    { mrn: '5678623523', ipNumber: '6543', name: 'Priya Desai', age: '54Y', gender: 'Female', admittedBy: 'Dr. Rohan Kumar', bed: 'Room 24 - Bed 6' },
    { mrn: '9876543210', ipNumber: '9876543210', name: 'Rohan Patel', age: '98Y', gender: 'Male', admittedBy: 'Dr. Aryan Patel', bed: 'Room 24 - Bed 2' },
    { mrn: '1122334455', ipNumber: '1122334455', name: 'Ananya Gupta', age: '32Y', gender: 'Female', admittedBy: 'Dr. Nikita Joshi', bed: 'Room 15 - Bed 1' },
    { mrn: '7777777777', ipNumber: '76543', name: 'Vikram Singh', age: '76Y', gender: 'Male', admittedBy: 'Dr. Ananya Reddy', bed: 'Room 18 - Bed 3' },
    { mrn: '8888888888', ipNumber: '8888888888', name: 'Nisha Mehta', age: '44Y', gender: 'Female', admittedBy: 'Dr. Vikram Mehta', bed: 'Room 20 - Bed 5' },
    { mrn: '0000000000', ipNumber: '0000000000', name: 'Sonia Choudhary', age: '21Y', gender: 'Female', admittedBy: 'Dr. Sahil Kapoor', bed: 'Room 14 - Bed 7' },
    { mrn: '1111111111', ipNumber: '34567', name: 'Aarav Kumar', age: '63Y', gender: 'Male', admittedBy: 'Dr. Naina Gupta', bed: 'Room 22 - Bed 8' },
    { mrn: '3333333333', ipNumber: '3333333333', name: 'Jiya Verma', age: '89Y', gender: 'Female', admittedBy: 'Dr. Aisha Khan', bed: 'Room 17 - Bed 9' },
    { mrn: '4444444444', ipNumber: '76543', name: 'Rajat Kapoor', age: '70Y', gender: 'Male', admittedBy: 'Dr. Yash Malhotra', bed: 'Room 19 - Bed 10' },
    { mrn: '6666666666', ipNumber: '6666666666', name: 'Ishaan Khanna', age: '12Y', gender: 'Male', admittedBy: 'Dr. Arjun Mehta', bed: 'Room 12 - Bed 11' },
    { mrn: '7777777777', ipNumber: '6578909876', name: 'Mira Shah', age: '57Y', gender: 'Female', admittedBy: 'Dr. Anushka Patel', bed: 'Room 13 - Bed 12' },
    { mrn: '9999999999', ipNumber: '9999999999', name: 'Aisha Bhatia', age: '30Y', gender: 'Female', admittedBy: 'Dr. Riya Deshmukh', bed: 'Room 16 - Bed 13' },
    { mrn: '0000000000', ipNumber: '0000000000', name: 'Pooja Rao', age: '68Y', gender: 'Female', admittedBy: 'Dr. Priya Sharma', bed: 'Room 21 - Bed 14' },
    { mrn: '0000000000', ipNumber: '0000000000', name: 'Pooja Rao', age: '42Y', gender: 'Female', admittedBy: 'Dr. Priya Sharma', bed: 'Room 23 - Bed 15' }
  ];

  // Filter patients based on search terms
  const filteredPatients = patientData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.includes(searchTerm) ||
    patient.admittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.ipNumber.includes(ipSearchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50"
        >
          ←
        </button>
      );
    }

    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50"
        >
          →
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="w-full h-full flex bg-white flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">IP Prescription</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 bg-[#FDFDFE] overflow-auto">
        <div className="w-full max-w-7xl mx-auto">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              
              <input
                type="text"
                placeholder="Search by name, MRN, or doctor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative flex-1 max-w-sm">
              
              <input
                type="text"
                placeholder="IP number"
                value={ipSearchTerm}
                onChange={(e) => setIpSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors">
              Filter
            </button>
          </div>

      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Table Header */}
        <div className="bg-cyan-50 border-b border-gray-200">
          <div className="grid grid-cols-7 gap-4 px-6 py-3">
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              MRN
            </div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              IP NUMBER
            </div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              NAME
            </div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              AGE
            </div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              GENDER
            </div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              ADMITTED BY
            </div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              BED
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {paginatedPatients.length > 0 ? (
            paginatedPatients.map((patient, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="text-sm text-gray-900">{patient.mrn}</div>
                <div className="text-sm text-gray-900">{patient.ipNumber}</div>
                <div className="text-sm text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-900">{patient.age}</div>
                <div className="text-sm text-gray-900">{patient.gender}</div>
                <div className="text-sm text-gray-900">{patient.admittedBy}</div>
                <div className="text-sm text-gray-900">{patient.bed}</div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <img className='h-16' src="/images/EmptyDocuments.png" alt="No results" />
                <p className="text-gray-500 mt-4">No patients found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} ({filteredPatients.length} patients)
              </div>
              <div className="flex items-center gap-1">
                {renderPageNumbers()}
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}