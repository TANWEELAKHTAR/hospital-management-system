import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const OTBooking = () => {
  const [selectedOT, setSelectedOT] = useState(null);

  const handleSelect = (ot) => {
    setSelectedOT(ot);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Book OT</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">
              01
            </div>
            <span className="font-medium">OT availability & selection</span>
          </div>
          <div className="flex items-center text-gray-400">
            <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center mr-2">
              02
            </div>
            <span>Assign staff</span>
          </div>
        </div>
      </div>

      <div className="border p-4 rounded mb-4 bg-gray-50">
        <p><span className="font-semibold">Requested by:</span> Dr Manoj Kumar</p>
        <p><span className="font-semibold">Procedure:</span> Sample procedure</p>
        <p><span className="font-semibold">Preferred date & time:</span> 12/12/2025; 20:30</p>
        <p><span className="font-semibold">Patient:</span> <span className="text-green-600 font-medium">Ms Juno Jane</span></p>
      </div>

      <div className="border p-4 rounded mb-6">
        <p className="font-semibold mb-2">Available OT(s) on requested date & time</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["OT-1", "OT-2", "OT-3", "OT-4"].map((ot) => (
            <div key={ot} className="border rounded p-3 text-center">
              <p className="font-medium mb-2">{ot}</p>
              <Button 
                variant="outline" 
                onClick={() => handleSelect(ot)}
                className={selectedOT === ot ? "bg-blue-100 border-blue-500" : ""}
              >
                Select
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <p className="text-sm text-gray-500">Select an OT to continue</p>
        <div className="space-x-2">
          <Button variant="outline">Save & close</Button>
          <Button disabled={!selectedOT}>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default OTBooking;
