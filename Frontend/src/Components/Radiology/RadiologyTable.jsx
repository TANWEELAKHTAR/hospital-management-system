import React from 'react';

const radiologyData = [
  {
    patient: 'Ms. Shruti Sharma',
    service: 'MRI',
    date: '12/05/2025',
    technician: 'Manoj Kumar',
    radiologist: 'Manoj Kumar',
    status: 'Pending',
  },
  {
    patient: 'Mr. Sahil Sharma',
    service: 'X-ray',
    date: '15/05/2025',
    technician: 'Pramod Kumar',
    radiologist: 'Pramod Kumar',
    status: 'Pending',
  },
  {
    patient: 'Mrs. Rekha Sign',
    service: 'CT Scan',
    date: '25/05/2025',
    technician: 'Preveshna Sharma',
    radiologist: 'Preveshna Sharma',
    status: 'In-progress',
  },
  {
    patient: 'Dr. Anil Mehta',
    service: 'Ultrasound',
    date: '01/06/2025',
    technician: 'Sita Patel',
    radiologist: 'Sita Patel',
    status: 'In-progress',
  },
  {
    patient: 'Ms. Kavita Rao',
    service: 'PET Scan',
    date: '07/06/2025',
    technician: 'Rajesh Singh',
    radiologist: 'Rajesh Singh',
    status: 'Pending',
  },
  {
    patient: 'Mr. Vikram Joshi',
    service: 'Mammogram',
    date: '14/06/2025',
    technician: 'Anjali Mehta',
    radiologist: 'Anjali Mehta',
    status: 'Pending',
  },
  {
    patient: 'Mrs. Priya Patel',
    service: 'Angiography',
    date: '21/06/2025',
    technician: 'Vikram Joshi',
    radiologist: 'Vikram Joshi',
    status: 'Pending',
  },
  {
    patient: 'Mr. Ramesh Chandra',
    service: 'Fluoroscopy',
    date: '28/06/2025',
    technician: 'Nisha Rani',
    radiologist: 'Nisha Rani',
    status: 'In-progress',
  },
  {
    patient: 'Ms. Neha Verma',
    service: 'Bone Scan',
    date: '05/07/2025',
    technician: 'Karan Verma',
    radiologist: 'Karan Verma',
    status: 'In-progress',
  },
  {
    patient: 'Dr. Amit Singh',
    service: 'Endoscopy',
    date: '12/07/2025',
    technician: 'Aditi Kapoor',
    radiologist: 'Aditi Kapoor',
    status: 'In-progress',
  },
];

const StatusBadge = ({ status }) => {
  const base = 'px-2 py-1 text-xs font-semibold rounded-full';
  const styles = {
    Pending: `${base} bg-yellow-100 text-yellow-800`,
    'In-progress': `${base} bg-blue-100 text-blue-800`,
  };
  return <span className={styles[status]}>{status}</span>;
};

const RadiologyTable = () => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-[#DFFCFA] text-left text-xs font-semibold text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3">Patient</th>
            <th className="px-4 py-3">Radiology Service</th>
            <th className="px-4 py-3">Service Date</th>
            <th className="px-4 py-3">Assigned Technician</th>
            <th className="px-4 py-3">Radiologist</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {radiologyData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">{item.patient}</td>
              <td className="px-4 py-3">{item.service}</td>
              <td className="px-4 py-3">{item.date}</td>
              <td className="px-4 py-3">{item.technician}</td>
              <td className="px-4 py-3">{item.radiologist}</td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-blue-600 underline cursor-pointer">
                Open case
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RadiologyTable;
