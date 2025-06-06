import React from "react";

const data = [
  {
    mrn: "12345432343",
    ip: "12345432343",
    name: "Arnav Sharma",
    age: "25Y",
    gender: "Male",
    phone: "1234567890",
    admittedBy: "Dr. Arnav Sharma",
  },
  {
    mrn: "5678623523",
    ip: "6543",
    name: "Priya Desai",
    age: "54Y",
    gender: "Male",
    phone: "1234567890",
    admittedBy: "Dr. Rohan Kumar",
  },
  {
    mrn: "9876543210",
    ip: "9876543210",
    name: "Rohan Patel",
    age: "98Y",
    gender: "Female",
    phone: "1234567890",
    admittedBy: "Dr. Aryan Patel",
  },
  {
    mrn: "1122334455",
    ip: "1122334455",
    name: "Ananya Gupta",
    age: "32Y",
    gender: "Male",
    phone: "1234567890",
    admittedBy: "Dr. Nikita Joshi",
  },
  // ... Add other rows here
];

export default function BillingTable() {
  return (
    <div className="p-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-teal-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">MRN</th>
              <th className="px-4 py-3">IP Number</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Phone Number</th>
              <th className="px-4 py-3">Admitted By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2">{row.mrn}</td>
                <td className="px-4 py-2">{row.ip}</td>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.age}</td>
                <td className="px-4 py-2">{row.gender}</td>
                <td className="px-4 py-2">{row.phone}</td>
                <td className="px-4 py-2">{row.admittedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">Page 1 of 30</p>
        <div className="flex gap-1 text-sm">
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                page === 1
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
