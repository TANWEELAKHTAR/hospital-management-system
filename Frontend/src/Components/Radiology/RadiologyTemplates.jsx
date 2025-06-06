import React from "react";

const TemplateCard = () => (
  <div className="bg-white shadow rounded p-4">
    <h3 className="font-semibold text-sm mb-1">Template name</h3>
    <p className="text-xs text-gray-500">Yet another placeholder description</p>
  </div>
);

const RadiologyTemplates = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-bold text-lg mb-6">Radiology</h2>
        <nav className="space-y-3">
          <button className="block text-gray-700 hover:text-black">Open case</button>
          <button className="block text-gray-700 hover:text-black">Completed case</button>
          <button className="block text-teal-600 font-semibold">Saved Templates</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Saved templates</h1>
          <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
            Create template
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Search"
            className="border px-3 py-2 rounded w-64"
          />
          <button className="border px-3 py-2 rounded flex items-center gap-1 hover:bg-gray-50">
            <span className="material-icons">filter_alt</span>
            Filter
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <TemplateCard key={index} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 text-sm text-gray-600">
          <span>Page 1 of 30</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded bg-gray-200">1</button>
            <button className="px-2 py-1 rounded hover:bg-gray-200">2</button>
            <button className="px-2 py-1 rounded hover:bg-gray-200">3</button>
            <button className="px-2 py-1 rounded hover:bg-gray-200">4</button>
            <button className="px-2 py-1 rounded hover:bg-gray-200">5</button>
            <button className="px-2 py-1 rounded hover:bg-gray-200">&gt;</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RadiologyTemplates;
