import { useState } from 'react';

export default function RadiologyReportEditor() {
    const [template, setTemplate] = useState("");

    return (
        <div className="flex h-screen">
            

            {/* Content */}
            <div className="flex-1 bg-gray-50 p-4">
                {/* Top bar */}
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <div>
                        <h1 className="text-lg font-semibold">Radiology Report</h1>
                        <div className="text-sm text-gray-600 mt-1 space-x-2">
                            <span><strong>Patient:</strong> Mr Manoj Kumar</span>
                            <span>• <strong>MRN:</strong> 1234567890</span>
                            <span>• <strong>DOB:</strong> 12/12/2025</span>
                            <span>• <strong>Age:</strong> 32Y</span>
                            <span>• <strong>Service:</strong> CT Scan</span>
                            <span>• <strong>Service date:</strong> 12/12/2024</span>
                            <span>• <strong>Referred by:</strong> Dr Madhu Kumar</span>
                        </div>
                    </div>
                    <div className="space-x-2">
                        <button className="bg-transparent border border-gray-300 text-gray-700 px-4 py-1 rounded">Cancel</button>
                        <button className="bg-blue-100 text-blue-700 px-4 py-1 rounded">Save as draft</button>
                        <button className="bg-green-600 text-white px-4 py-1 rounded">Save & sign</button>
                        <button className="bg-transparent text-green-600 underline px-2">Save as template</button>
                    </div>
                </div>

                {/* Template selection */}
                <div className="mb-4">
                    <label className="block text-sm mb-1">Template</label>
                    <select
                        className="border w-1/3 p-2 rounded"
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="template1">Template 1</option>
                        <option value="template2">Template 2</option>
                    </select>
                </div>

                {/* Editor */}
                <div className="bg-white border rounded p-4 mb-6 min-h-[300px]">
                    <div className="mb-2 flex items-center space-x-2 text-gray-600 text-sm">
                        <button className="font-bold">B</button>
                        <button className="italic">I</button>
                        <button className="underline">U</button>
                        <button className="line-through">S</button>
                        <button>{`< >`}</button>
                        <button>&#x2022;</button>
                        <button>&#x25A0;</button>
                    </div>
                    <textarea
                        className="w-full h-60 border-none focus:ring-0 resize-none"
                        placeholder="Enter"
                    />
                </div>

                {/* Summary Section */}
                <div className="bg-white border rounded p-4">
                    <h2 className="font-semibold text-sm text-gray-700 mb-2">IMPRESSION / SUMMARY</h2>
                    <p className="text-xs text-gray-500 mb-1">Label from template</p>
                    <textarea
                        className="w-full h-20 border rounded p-2"
                        placeholder="Enter"
                    />
                </div>
            </div>
        </div>
    );
}
