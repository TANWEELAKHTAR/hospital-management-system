import { FileText } from 'lucide-react';

export default function OTTable() {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead className="bg-cyan-100 text-sm text-gray-700 uppercase text-left">
            <tr>
              <th className="px-6 py-3">OT Identifier</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Capacity</th>
              <th className="px-6 py-3">Availibility</th>
              <th className="px-6 py-3">Equipment</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
        </table>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-12 h-12 text-cyan-400 mb-2" />
          <p className="text-sm text-gray-500">No OT found</p>
        </div>
      </div>
    </div>
  );
}
