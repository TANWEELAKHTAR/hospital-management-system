import { useState } from "react";

export default function EditStockAdjustments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Sample data
  const adjustments = [
    { id: 1, itemName: 'Item 1', batchNo: 'BTC123487', currentStock: 500, adjustmentValue: '+ 20', reason: 'Damaged items' },
    { id: 2, itemName: 'Item 2', batchNo: 'BTC123487', currentStock: 2500, adjustmentValue: '- 20', reason: 'Wrong entry' },
    { id: 3, itemName: 'Item 3', batchNo: 'BTC123487', currentStock: 1500, adjustmentValue: '+ 20', reason: 'Wrong entry' },
    { id: 4, itemName: 'Item 4', batchNo: 'BTC123487', currentStock: 500, adjustmentValue: '- 20', reason: 'Damaged items' },
    { id: 5, itemName: 'Item 5', batchNo: 'BTC123487', currentStock: 2000, adjustmentValue: '+ 20', reason: 'Wrong entry' },
    { id: 6, itemName: 'Item 6', batchNo: 'BTC123487', currentStock: 3200, adjustmentValue: '- 20', reason: 'Damaged items' },
    { id: 7, itemName: 'Item 7', batchNo: 'BTC123487', currentStock: 500, adjustmentValue: '+ 20', reason: 'Damaged items' },
    { id: 8, itemName: 'Item 8', batchNo: 'BTC123487', currentStock: 4000, adjustmentValue: '+ 20', reason: 'Unbilled consumption' },
    { id: 9, itemName: 'Item 9', batchNo: 'BTC123487', currentStock: 200, adjustmentValue: '+ 20', reason: 'Damaged items' },
    { id: 10, itemName: 'Item 10', batchNo: 'BTC123487', currentStock: 100, adjustmentValue: '+ 20', reason: 'Damaged items' },
  ];

  // Filter icon SVG
  const FilterIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );

  // Search icon SVG
  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Stock Adjustments</h1>
        <div className="flex gap-4">
          <button className="cursor-pointer bg-[#0D8E83] px-4 py-1 text-sm rounded-lg text-white">
            Add adjustments
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <SearchIcon />
          </div>
        </div>
        
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-green-100"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FilterIcon />
          Filter
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-green-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Batch No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Current Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Adjustment Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adjustments.map((adjustment) => (
              <tr key={adjustment.id} className="hover:bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {adjustment.itemName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {adjustment.batchNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {adjustment.currentStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {adjustment.adjustmentValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {adjustment.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
