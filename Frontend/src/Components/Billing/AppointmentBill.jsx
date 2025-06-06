import React from "react";

export default function AppointmentBill() {
  return (
    <div className="p-6 bg-white text-sm text-gray-800 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          <span className="text-xl">🧾</span> Appointment Bill
        </h2>
        <button className="text-gray-600 text-xl font-bold">&times;</button>
      </div>

      <div className="bg-yellow-100 text-yellow-800 p-3 rounded text-xs mb-4">
        ⚠️ Once finalized, you cannot edit charges or add new items.
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Section - Invoice Details */}
        <div className="flex-1 border rounded p-4">
          <div className="flex gap-4 items-start mb-4">
            <div className="text-4xl font-bold text-green-600">H</div>
            <div className="text-xs">
              <div className="font-bold text-sm">Hospital name here</div>
              <div>ABC street, xyz road, Trivandrum, Kerala</div>
              <div>
                <span className="text-blue-600">mail@mail.com</span> +1234567890
              </div>
            </div>
            <div className="ml-auto text-xs text-right space-y-1">
              <div><strong>Invoice number:</strong> INV2345</div>
              <div><strong>Invoice date:</strong> 12/12/2024</div>
              <div><strong>Type:</strong> In-Patient Bill</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div><strong>Patient Name:</strong> Mr. Manoj Kumar</div>
            <div><strong>Age:</strong> 24</div>
            <div><strong>Gender:</strong> Male</div>
            <div><strong>IP number:</strong> 1234567</div>
            <div><strong>Admission Date:</strong> 12/12/2025</div>
            <div><strong>Admitted by:</strong> Dr. John Joseph</div>
          </div>

          {/* Table */}
          <table className="w-full text-xs mb-4">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">DESCRIPTION</th>
                <th className="p-2">QTY</th>
                <th className="p-2">RATE (₹)</th>
                <th className="p-2">TOTAL (₹)</th>
              </tr>
            </thead>
            <tbody>
              {/* Room Charges */}
              <tr className="font-bold"><td className="pt-3" colSpan="4">Room Charges</td></tr>
              <Row desc="Sample ward, Room: 24, Bed: 04" qty="3 days" rate="500.00" total="1,500.00" />

              {/* Services */}
              <tr className="font-bold"><td className="pt-3" colSpan="4">Services</td></tr>
              <Row desc="Physiotherapy" qty="2 hrs" rate="500.00" total="1,000.00" />
              <Row desc="Dialysis" qty="4 hrs" rate="1000.00" total="4,000.00" />

              {/* Medications */}
              <tr className="font-bold"><td className="pt-3" colSpan="4">Medications</td></tr>
              <Row desc="Paracetamol | 250mg" qty="15 tab" rate="02.00" total="30.00" />
              <Row desc="Amoxicillin | 500mg" qty="10 capsule" rate="05.00" total="50.00" />
              <Row desc="Amoxicillin | 500ml" qty="2 bag" rate="200.00" total="400.00" />

              {/* Procedure */}
              <tr className="font-bold"><td className="pt-3" colSpan="4">Procedure</td></tr>
              <Row desc="Appendectomy" qty="1" rate="50,000.00" total="50,000.00" />
              <Row desc="Wound dressing" qty="3" rate="500.00" total="1,500.00" />

              {/* Miscellaneous */}
              <tr className="font-bold"><td className="pt-3" colSpan="4">Miscellaneous</td></tr>
              <Row desc="Attendant meal charges" qty="3" rate="500.00" total="1,500.00" />
              <Row desc="Extra bedding" qty="1" rate="200.00" total="200.00" />
            </tbody>
          </table>

          {/* Totals */}
          <div className="text-xs space-y-1 text-right">
            <div><strong>Subtotal</strong>: ₹60,180.00</div>
            <div><strong>Amount paid</strong>: ₹3,500.00</div>
            <div><strong>Discount</strong>: ₹1,000.00</div>
            <div><strong>GST</strong>: ₹1,000.00</div>
            <div className="font-bold text-base text-black">Payable amount: ₹58,680.00</div>
          </div>

          <p className="text-xs text-gray-500 mt-4 border-t pt-2">
            This is a system-generated invoice. Please retain it for your records. Contact the billing desk for any discrepancies.
          </p>
        </div>

        {/* Right Section - Payment Info */}
        <div className="w-full md:w-72 border rounded p-4 space-y-3 text-xs bg-gray-50">
          <div>
            <label className="block font-semibold mb-1">Discount % (if applicable)</label>
            <input className="w-full border rounded p-1" placeholder="00" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Payed amount</label>
            <input className="w-full border rounded p-1" placeholder="00.00" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Balance</label>
            <input className="w-full border rounded p-1 bg-gray-100" placeholder="Enter the payed amount to calculate" disabled />
          </div>
          <div>
            <label className="block font-semibold mb-1">Payment Method</label>
            <select className="w-full border rounded p-1">
              <option>Select</option>
              <option>Cash</option>
              <option>Card</option>
              <option>UPI</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white rounded px-3 py-1 text-sm">Confirm & print</button>
            <button className="bg-gray-200 rounded px-3 py-1 text-sm">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Row = ({ desc, qty, rate, total }) => (
  <tr>
    <td className="p-2 border-t border-gray-100">{desc}</td>
    <td className="p-2 border-t border-gray-100">{qty}</td>
    <td className="p-2 border-t border-gray-100">{rate}</td>
    <td className="p-2 border-t border-gray-100">{total}</td>
  </tr>
);
