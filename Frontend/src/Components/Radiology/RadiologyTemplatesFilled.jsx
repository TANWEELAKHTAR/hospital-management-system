export default function CreateTemplate() {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4">
          <h2 className="text-xl font-semibold mb-6">Radiology</h2>
          <nav className="space-y-3">
            <a href="#" className="block text-gray-700 hover:text-blue-600">Open case</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Completed case</a>
            <a href="#" className="block font-semibold text-green-600">Saved Templates</a>
          </nav>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Create Template</h1>
            <div className="space-x-2">
              <button className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100">Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Create</button>
            </div>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Template Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Template name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter" className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" placeholder="What’s it for?" className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
  
            {/* Editor */}
            <div>
              <label className="block text-sm font-medium mb-1">Enter</label>
              <textarea className="w-full h-60 border border-gray-300 rounded px-3 py-2" placeholder="Enter template content..."></textarea>
            </div>
          </div>
        </main>
      </div>
    );
  }
  