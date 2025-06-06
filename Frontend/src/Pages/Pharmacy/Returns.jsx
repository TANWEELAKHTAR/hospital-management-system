import { useState } from "react";

export default function Returns() {
  const [billNumber, setBillNumber] = useState("");

  const handleSearch = () => {
    if (billNumber.trim()) {
      // Handle search logic here
      console.log("Searching for bill:", billNumber);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full h-full flex bg-white flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Returns</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 bg-[#FDFDFE] overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Search for a Bill to Begin Return
            </h2>
            <p className="text-gray-600 mb-6">
              Submit the bill number to fetch the items eligible for return. Make sure the patient has the original bill for accurate tracking.
            </p>

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Bill number"
                  value={billNumber}
                  onChange={(e) => setBillNumber(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}