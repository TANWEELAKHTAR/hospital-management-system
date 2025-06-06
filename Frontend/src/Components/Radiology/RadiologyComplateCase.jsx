import { useState } from "react";

import { Filter } from "lucide-react";

const completedCases = [
  {
    patient: "Ms. Shruti Sharma",
    service: "MRI",
    date: "12/05/2025",
    technician: "Manoj Kumar",
    radiologist: "Manoj Kumar",
  },
  {
    patient: "Mr. Sahil Sharma",
    service: "X-ray",
    date: "15/05/2025",
    technician: "Pramod Kumar",
    radiologist: "Pramod Kumar",
  },
  {
    patient: "Mrs. Rekha Sign",
    service: "CT Scan",
    date: "25/05/2025",
    technician: "Preveshna Sharma",
    radiologist: "Preveshna Sharma",
  },
  {
    patient: "Dr. Anil Mehta",
    service: "Ultrasound",
    date: "01/06/2025",
    technician: "Sita Patel",
    radiologist: "Sita Patel",
  },
  {
    patient: "Ms. Kavita Rao",
    service: "PET Scan",
    date: "07/06/2025",
    technician: "Rajesh Singh",
    radiologist: "Rajesh Singh",
  },
  {
    patient: "Mr. Vikram Joshi",
    service: "Mammogram",
    date: "14/06/2025",
    technician: "Anjali Mehta",
    radiologist: "Anjali Mehta",
  },
  {
    patient: "Mrs. Priya Patel",
    service: "Angiography",
    date: "21/06/2025",
    technician: "Vikram Joshi",
    radiologist: "Vikram Joshi",
  },
  {
    patient: "Mr. Ramesh Chandra",
    service: "Fluoroscopy",
    date: "28/06/2025",
    technician: "Nisha Rani",
    radiologist: "Nisha Rani",
  },
  {
    patient: "Ms. Neha Verma",
    service: "Bone Scan",
    date: "05/07/2025",
    technician: "Karan Verma",
    radiologist: "Karan Verma",
  },
  {
    patient: "Dr. Amit Singh",
    service: "Endoscopy",
    date: "12/07/2025",
    technician: "Aditi Kapoor",
    radiologist: "Aditi Kapoor",
  },
];

export default function CompletedCases() {
  const [search, setSearch] = useState("");

  const filteredCases = completedCases.filter((item) =>
    item.patient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <div className="p-4 text-lg font-semibold">Radiology</div>
        <nav className="flex flex-col text-sm">
          <button className="text-left px-4 py-2 hover:bg-gray-100">Open case</button>
          <button className="text-left px-4 py-2 bg-blue-100 text-blue-700 font-medium">
            Completed case
          </button>
          <button className="text-left px-4 py-2 hover:bg-gray-100">Saved Templates</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Radiology Completed case</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-md border">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-100 text-blue-800 font-medium">
              <tr>
                <th className="px-4 py-2">PATIENT</th>
                <th className="px-4 py-2">RADIOLOGY SERVICE</th>
                <th className="px-4 py-2">SERVICE DATE</th>
                <th className="px-4 py-2">ASSIGNED TECHNICIAN</th>
                <th className="px-4 py-2">RADIOLOGIST</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="px-4 py-2">{item.patient}</td>
                  <td className="px-4 py-2">{item.service}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.technician}</td>
                  <td className="px-4 py-2">{item.radiologist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
