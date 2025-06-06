import React, { useState } from 'react';
import { FileText, Search } from 'lucide-react';

export default function OTsetupform() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [equipment, setEquipment] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addEquipment = () => {
    if (equipment.trim()) {
      setEquipmentList([...equipmentList, equipment.trim()]);
      setEquipment('');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">OT setup</h2>
        <div className="space-x-2">
          <button className="px-4 py-2 rounded border text-sm">Cancel</button>
          <button className="px-4 py-2 rounded bg-emerald-500 text-white text-sm">Add</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Details */}
        <div className="bg-white p-4 rounded-md border">
          <h3 className="text-sm font-semibold mb-4 text-gray-700">Basic Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Identifier</label>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>Select</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Type/Speciality<span className="text-red-500">*</span></label>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>Select</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Capacity<span className="text-red-500">*</span></label>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>Select</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Status<span className="text-red-500">*</span></label>
              <div className="flex space-x-4 mt-1">
                <label className="flex items-center space-x-1">
                  <input type="radio" name="status" />
                  <span>Active</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input type="radio" name="status" />
                  <span>Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Timings */}
        <div className="bg-white p-4 rounded-md border">
          <h3 className="text-sm font-semibold mb-4 text-gray-700">Timings</h3>
          <label className="block text-sm mb-2">Select day<span className="text-red-500">*</span></label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <label key={day} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Opens at</label>
              <input type="time" className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm mb-1">Closes at<span className="text-red-500">*</span></label>
              <input type="time" className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <button className="px-4 py-2 rounded bg-gray-200 text-sm" disabled>Add</button>

          <div className="mt-4 space-y-1">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <div key={day} className="flex justify-between items-center px-3 py-2 border rounded text-sm">
                <span>{day}</span>
                <button className="text-gray-500">--</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="mt-4 bg-white p-4 rounded-md border max-w-md">
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Equipment</h3>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm pl-10"
              placeholder="Search"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={addEquipment}
            className="px-4 py-2 rounded bg-gray-200 text-sm"
          >
            Add
          </button>
        </div>

        {equipmentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileText className="w-10 h-10 text-cyan-400 mb-2" />
            <p className="text-sm">No Equipments added</p>
          </div>
        ) : (
          <ul className="list-disc pl-5 text-sm">
            {equipmentList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
