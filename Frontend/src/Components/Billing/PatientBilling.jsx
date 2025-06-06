import { useState } from 'react';

export default function PatientBillingDashboard() {
  const [activeTab, setActiveTab] = useState("BILL_SUMMARY");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-4 space-y-2 overflow-y-auto">
        <div className="font-bold text-lg mb-4">Global Refresh</div>
        <nav className="space-y-1 text-sm">
          <div className="hover:bg-blue-800 p-2 rounded">Estimate Bill</div>
          <div className="hover:bg-blue-800 p-2 rounded">Pre Authorization Request</div>
          <div className="text-gray-400 p-2 cursor-not-allowed">Service Charge Management</div>
          <div className="hover:bg-blue-800 p-2 rounded">Package Assignment</div>
          <div className="hover:bg-blue-800 p-2 rounded">Package Assignment New</div>
          <div className="hover:bg-blue-800 p-2 rounded">Customized Package Creation</div>
          <div className="hover:bg-blue-800 p-2 rounded">Discharges</div>
          <div className="hover:bg-blue-800 p-2 rounded flex justify-between">
            Billing Work List <span className="bg-red-500 px-2 rounded">0</span>
          </div>
          {/* Add more items as needed */}
        </nav>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-4 space-y-4">
        {/* Top Search */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Patient"
            className="border p-2 rounded w-64"
            defaultValue="IP2200015"
          />
          <input
            type="text"
            placeholder="Search by Bill No"
            className="border p-2 rounded w-64"
          />
          <button className="text-blue-600 underline">Clear</button>
        </div>

        {/* Patient Info */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <div className="font-semibold">Mr. GIRIDHAR S V</div>
              <div className="text-sm text-gray-600">IP No.: IP2200015 / NA</div>
              <div className="text-sm text-gray-600">Age / Gender: 58 yrs / Male</div>
              <div className="text-sm text-gray-600">Ward/Bed: PRIVATE WARD/AW-104</div>
              <div className="text-sm text-gray-600">Admission Date: 04/11/2022</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2">
          {["BILL SUMMARY", "BILL DETAILS", "PAYMENT / DEPOS...", "DISCOUNT", "AUTHORIZATION", "CONTRACT", "DISCHARGE", "FOLIO CLOSURE"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-t ${activeTab === tab ? 'bg-white border-t border-l border-r text-blue-600' : 'bg-gray-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-4 border rounded shadow text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Payer Name:</strong> Star Health Insurance</p>
              <p><strong>Plan Name:</strong> Star Gold</p>
              <p><strong>Policy No.:</strong> SH120000000234</p>
              <p><strong>Patient Address:</strong> HOUSE # 23/45/1A, Ongole</p>
              <p><strong>Initiated Discharge Date:</strong> 06-11-2022</p>
              <p><strong>Discharge Status:</strong> Occupied</p>
            </div>
            <div>
              <table className="w-full text-right">
                <tbody>
                  <tr><td>Co-Pay (Bill)</td><td>-500.00</td><td>500.00</td></tr>
                  <tr><td>Deductible</td><td>-428.00</td><td>428.00</td></tr>
                  <tr><td className="font-semibold">Net Amount</td><td></td><td className="font-bold">1,706.00</td></tr>
                </tbody>
              </table>
              <p className="mt-4 font-semibold">Balance: 0.00</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
