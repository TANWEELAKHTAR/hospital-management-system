import React from "react";

const RadiologyComplateCaseViews = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold">Radiology Report</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Print</button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Patient:</strong> Mr Manoj Kumar</p>
                <p><strong>MRN:</strong> 1234567890</p>
                <p><strong>DOB:</strong> 12/12/2025</p>
                <p><strong>Age:</strong> 32Y</p>
                <p><strong>Service:</strong> CT Scan</p>
                <p><strong>Service date:</strong> 12/12/2024</p>
                <p><strong>Referred By:</strong> Dr Madhu Kumar</p>
            </div>

            <div className="mt-6 space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Clinical Indication:</h2>
                    <p>Recurrent headaches and episodes of dizziness. Rule out intracranial pathology.</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Technique:</h2>
                    <p>Multiplanar, multisequence MRI of the brain was performed before and after intravenous administration of gadolinium contrast.</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Findings:</h2>

                    <div className="pl-4">
                        <h3 className="font-medium">Brain Parenchyma:</h3>
                        <ul className="list-disc list-inside">
                            <li>No acute infarct, hemorrhage, or mass lesion identified.</li>
                            <li>No evidence of abnormal diffusion restriction.</li>
                            <li>No abnormal enhancement post-contrast.</li>
                            <li>Ventricular system and sulci are within normal limits for age.</li>
                            <li>No midline shift.</li>
                        </ul>

                        <h3 className="font-medium mt-4">Sinuses and Orbits:</h3>
                        <ul className="list-disc list-inside">
                            <li>Mild mucosal thickening noted in the maxillary sinuses bilaterally.</li>
                            <li>Orbits and optic nerves appear unremarkable.</li>
                        </ul>

                        <h3 className="font-medium mt-4">Vasculature:</h3>
                        <ul className="list-disc list-inside">
                            <li>Circle of Willis shows normal flow voids. No evidence of aneurysm or vascular malformation.</li>
                        </ul>

                        <h3 className="font-medium mt-4">Posterior Fossa:</h3>
                        <ul className="list-disc list-inside">
                            <li>Cerebellum, brainstem, and fourth ventricle are normal.</li>
                            <li>No Chiari malformation.</li>
                        </ul>

                        <h3 className="font-medium mt-4">Skull Base and Calvarium:</h3>
                        <ul className="list-disc list-inside">
                            <li>No osseous abnormality.</li>
                        </ul>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Impression / Summary</h2>
                    <p>This is a summary of the report as placeholder</p>
                </div>
            </div>
        </div>
    );
};

export default RadiologyComplateCaseViews;
