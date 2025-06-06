import React from "react";

export default function RadiologyReport() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center">
        <div className="text-lg font-semibold">Radiology Report</div>
        <div className="space-x-2">
          <button className="px-4 py-1 border rounded hover:bg-gray-100">Cancel</button>
          <button className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
          <button className="px-4 py-1 border rounded hover:bg-gray-100">Sign & print</button>
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm text-sm flex flex-wrap gap-4">
        <p><strong>Patient:</strong> Mr Manoj Kumar</p>
        <p><strong>MRN:</strong> 1234567890</p>
        <p><strong>DOB:</strong> 12/12/2025</p>
        <p><strong>Age:</strong> 32Y</p>
        <p><strong>Phone:</strong> 1234567890</p>
        <p><strong>Email:</strong> mail@mail.com</p>
        <p><strong>Service:</strong> CT Scan</p>
        <p><strong>Service date:</strong> 12/12/2024</p>
      </div>

      {/* Report Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Form Area */}
        <div className="flex-1 bg-white p-4 border border-gray-200 rounded-lg space-y-4">
          <h2 className="text-gray-700 font-semibold text-sm tracking-wide">
            &lt;TEMPLATE NAME HERE&gt;
          </h2>

          {/* Report Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx}>
                <label className="text-xs text-gray-500 block mb-1">Label from template</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
                  placeholder="Enter"
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">IMPRESSION / SUMMARY</label>
            <textarea
              rows={4}
              placeholder="Enter"
              className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
            />
          </div>
        </div>

        {/* Right: Report Preview */}
        <div className="w-full lg:w-[350px] border border-gray-200 bg-white p-4 rounded-lg space-y-2 text-sm">
          <div className="flex items-start gap-2 mb-2">
            <div className="text-2xl font-bold text-green-600">H</div>
            <div>
              <div className="font-semibold">Hospital name here</div>
              <div className="text-gray-600 text-xs">
                ABC street, xyz road, Trivandrum, Kerala<br />
                <span className="text-blue-600">mail@mail.com</span> +1234567890
              </div>
            </div>
          </div>

          <hr />

          <div>
            <div><strong>Patient:</strong> Mr. Manoj Kumar</div>
            <div><strong>Gender:</strong> Male</div>
            <div><strong>Age:</strong> Mr. Manoj Kumar</div>
            <div><strong>UPIN no:</strong> 1234543234</div>
            <div><strong>Service:</strong> CT-Scan</div>
            <div><strong>Service date:</strong> 12/12/2024</div>
            <div><strong>Consultant:</strong> Dr. Ravi kumar - MBBS MD - Gen Medicine</div>
          </div>

          <hr />

          <div>
            <div className="font-semibold">Report Details:</div>
            <div><strong>Field:</strong> Field from template</div>
            <div><strong>Field:</strong> -</div>
            <div><strong>Label:</strong> -</div>
          </div>

          <div>
            <strong>Impression/summary</strong><br />
            -
          </div>

          <div>
            <div><strong>Report date:</strong> -</div>
            <div><strong>Radiologist:</strong> Rajesh Kumar</div>
            <div><strong>Signature:</strong> -</div>
          </div>

          <p className="text-[10px] text-gray-400 pt-2 border-t mt-2">
            This is a system-generated report. Please retain it for your records. Contact the billing desk for any discrepancies.
          </p>
        </div>
      </div>
    </div>
  );
}
