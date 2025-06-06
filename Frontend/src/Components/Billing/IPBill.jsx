import React from "react";

const data = {
  patientName: "Mr. Manoj Kumar",
  age: 24,
  gender: "Male",
  admittedBy: "Dr. John Joseph",
  invoiceNo: "INV2345",
  date: "12/12/2024",
  billType: "In-Patient Bill",
  contact: {
    email: "mail@mail.com",
    phone: "+1234567890",
    address: "ABC street, xyz road, Trivandrum, Kerala",
  },
};

export default function IPBill() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          ← {data.patientName} - IP bill
        </h2>
        <div className="space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
            Print provisional bill
          </button>
          <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
            Finalize bill
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Sections */}
        <div className="flex-1 space-y-4">
          <Section title="Room Charges">
            <TableRow columns={["Sample ward", "24", "04", "500", "Enter", "1500.00", "Paid"]} />
            <Footer amount="0.00" />
          </Section>

          <Section title="Services">
            <TableRow columns={["Physiotherapy", "2 Hr", "500.00", "Enter", "1000.00", "Un-Paid"]} />
            <TableRow columns={["Dialysis", "4 Hr", "1000.00", "Enter", "4000.00", "2,000.00"]} />
            <AddItem />
            <Footer amount="3,000.00" />
          </Section>

          <Section title="Medications">
            <TableRow columns={["Paracetamol | 250mg", "15", "Tablet", "02.00", "30.00", "Un-Paid"]} />
            <TableRow columns={["Amoxicillin | 500mg", "10", "Capsule", "05.00", "50.00", "Un-Paid"]} />
            <TableRow columns={["Normal Saline | 500ml", "2", "Bag", "200.00", "400.00", "Un-Paid"]} />
            <Footer amount="1,200.00" />
          </Section>

          <Section title="Procedure">
            <TableRow columns={["Appendectomy", "1", "50,000", "50,000", "Un-Paid"]} />
            <TableRow columns={["Wound Dressing", "3", "500", "1,500", "Un-Paid"]} />
            <AddItem />
            <Footer amount="51,500.00" />
          </Section>

          <Section title="Miscellaneous">
            <TableRow columns={["Attendant Meal Charges", "3", "500.00", "1,500.00", "Un-Paid"]} />
            <TableRow columns={["Extra Bedding", "1", "200.00", "200.00", "Un-Paid"]} />
            <AddItem />
            <Footer amount="175.00" />
          </Section>
        </div>

        {/* Right: Summary Card */}
        <div className="w-full lg:w-[400px] bg-white border border-gray-200 rounded-lg p-4 space-y-2 shadow-sm">
          <div className="flex gap-2 items-start">
            <div className="text-2xl font-bold text-green-600">H</div>
            <div>
              <div className="font-semibold">Hospital name here</div>
              <div className="text-xs text-gray-600">
                {data.contact.address}<br />
                <span className="text-blue-600">{data.contact.email}</span> {data.contact.phone}
              </div>
            </div>
          </div>

          <hr />
          <div className="text-sm space-y-1">
            <div><strong>Invoice number:</strong> {data.invoiceNo}</div>
            <div><strong>Invoice date:</strong> {data.date}</div>
            <div><strong>Type:</strong> {data.billType}</div>
          </div>
          <div className="text-sm space-y-1 pt-2">
            <div><strong>Patient Name:</strong> {data.patientName}</div>
            <div><strong>Age:</strong> {data.age}</div>
            <div><strong>Gender:</strong> {data.gender}</div>
            <div><strong>IP number:</strong> 1234567</div>
            <div><strong>Date of Admission:</strong> 12/12/2025</div>
            <div><strong>Admitted by:</strong> {data.admittedBy}</div>
          </div>

          <hr />
          {/* Itemized Summary */}
          <div className="text-xs space-y-1">
            <ItemRow title="Room Charges" value="1,500.00" />
            <ItemRow title="Physiotherapy" value="1,000.00" />
            <ItemRow title="Dialysis" value="4,000.00" />
            <ItemRow title="Paracetamol | 250mg" value="30.00" />
            <ItemRow title="Amoxicillin | 500mg" value="50.00" />
            <ItemRow title="Normal Saline | 500ml" value="400.00" />
            <ItemRow title="Appendectomy" value="50,000.00" />
            <ItemRow title="Wound Dressing" value="1,500.00" />
            <ItemRow title="Attendant Meal Charges" value="1,500.00" />
            <ItemRow title="Extra Bedding" value="200.00" />
          </div>

          <hr />
          {/* Summary Totals */}
          <div className="text-sm space-y-1 pt-1">
            <ItemRow title="Subtotal" value="60,180.00" />
            <ItemRow title="Amount paid" value="3,500.00" />
            <ItemRow title="Discount" value="10%" />
            <ItemRow title="GST" value="18%" />
            <ItemRow title="Payable amount" value="18%" bold />
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <h3 className="font-semibold text-sm text-gray-700 mb-2">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const TableRow = ({ columns }) => (
  <div className="grid grid-cols-7 gap-2 text-xs items-center">
    {columns.map((col, i) => (
      <div
        key={i}
        className={`px-2 py-1 rounded ${col === "Un-Paid" ? "bg-red-100 text-red-700" : col === "Paid" ? "bg-green-100 text-green-700" : ""}`}
      >
        {col}
      </div>
    ))}
  </div>
);

const AddItem = () => (
  <button className="text-blue-600 text-xs mt-1 hover:underline">+ Add items</button>
);

const Footer = ({ amount }) => (
  <div className="text-right font-semibold text-sm pt-2 border-t mt-2">
    Amount Due for this Section: ₹ {amount}
  </div>
);

const ItemRow = ({ title, value, bold }) => (
  <div className="flex justify-between">
    <span className={bold ? "font-bold" : ""}>{title}</span>
    <span className={bold ? "font-bold" : ""}>{value}</span>
  </div>
);
