import React from "react";

import { Pencil, Trash2 } from "lucide-react";

const templates = [
  {
    name: "MRI report",
    description: "This is a placeholder description"
  },
  {
    name: "CT Scan Report",
    description: "This is a sample description for item one"
  },
  {
    name: "X Ray report",
    description: "Here we have a descriptive text for item two"
  },
  {
    name: "CT Scan results",
    description: "An engaging overview for item three is provided here"
  },
  {
    name: "MRI findings",
    description: "This content serves as a brief for item four"
  },
  {
    name: "Sample report",
    description: "A compelling narrative for item five can be found here"
  },
  {
    name: "Ultrasound images",
    description: "This statement encapsulates item six’s essence"
  },
  {
    name: "Sample report",
    description: "A detailed account of item seven is presented"
  },
  {
    name: "Dummy report",
    description: "This illustrates the features of item eight"
  },
  {
    name: "Placeholder report",
    description: "A succinct summary for item nine is outlined"
  }
];

export default function SavedTemplates() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Saved templates</h1>
        <div className="flex gap-2">
          <input placeholder="Search" className="w-64" />
          <button variant="outline">Filter</button>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead className="bg-teal-100">
          <tr>
            <th className="text-left p-2">TEMPLATE NAME</th>
            <th className="text-left p-2">DESCRIPTION</th>
            <th className="text-left p-2">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2">{template.name}</td>
              <td className="p-2">{template.description}</td>
              <td className="p-2 flex gap-2">
                <button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4" />
                </button>
                <button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <span>Page 1 of 30</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              className="px-3"
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
