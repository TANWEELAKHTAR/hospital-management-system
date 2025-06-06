

const RadiologySavedTemplateDetailViews = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Radiology Completed Case</h1>
        <div className="space-x-2">
          <button variant="destructive">Delete</button>
          <button>Edit</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-600 mb-2">
          <p>
            <strong>Patient:</strong> Mr Manoj Kumar &nbsp; | &nbsp;
            <strong>MRN:</strong> 1234567890 &nbsp; | &nbsp;
            <strong>DOB:</strong> 12/12/2025 &nbsp; | &nbsp;
            <strong>Age:</strong> 32Y &nbsp; | &nbsp;
            <strong>Service:</strong> CT Scan &nbsp; | &nbsp;
            <strong>Service date:</strong> 12/12/2024 &nbsp; | &nbsp;
            <strong>Referred By:</strong> Dr Madhu Kumar
          </p>
        </div>

        <div className="border border-gray-200 rounded p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-lg">MRI Report</h2>
            <p className="text-sm text-gray-500">This is a dummy text as placeholder for description</p>
          </div>

          <div className="space-y-3">
            <div>
              <strong>Clinical Indication:</strong>
              <p>{"(Enter details here)"}</p>
            </div>

            <div>
              <strong>Technique:</strong>
              <p>{"(Enter details here)"}</p>
            </div>

            <div>
              <strong>Findings:</strong>
              <p>{"(Enter details here)"}</p>
            </div>

            <div>
              <strong>Sinuses and Orbits:</strong>
              <p>{"(Enter details here)"}</p>
            </div>

            <div>
              <strong>Vasculature:</strong>
              <ul className="list-disc ml-6">
                <li>{"(Enter details here)"}</li>
              </ul>
            </div>

            <div>
              <strong>Posterior Fossa:</strong>
              <ul className="list-disc ml-6">
                <li>{"(Enter details here)"}</li>
              </ul>
            </div>

            <div>
              <strong>Skull Base and Calvarium:</strong>
              <p>{"(Enter details here)"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiologySavedTemplateDetailViews;
