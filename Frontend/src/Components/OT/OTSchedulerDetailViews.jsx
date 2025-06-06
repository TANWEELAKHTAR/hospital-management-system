import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const roles = {
  "Surgical Assistant": ["Ms. Sreena Jay", "Mr. Jay Prakash", "Ms. Sumati Sami"],
  "Scrub Nurse": [],
  "Circulating Nurse": [],
  "Anesthetist": [],
  "Technician": []
};

export default function OTScheduler() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-lg">OT Selected: <span className="font-normal">OT - 1</span></h2>
              <p>Doctor: <strong>Dr. Manoj Kumar</strong> &nbsp;|&nbsp; Procedure: <strong>ABC procedure</strong></p>
              <p>Date & time: <strong>12/12/2025, 20:30</strong> &nbsp;|&nbsp; Patient: <strong className="text-blue-600">Ms. Juno Jane</strong></p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Edit</Button>
              <Button>Mark as completed</Button>
            </div>
          </div>

          {Object.entries(roles).map(([role, users], index) => (
            <div key={index} className="border rounded-lg mb-2">
              <button className="w-full flex justify-between items-center p-3 text-left bg-gray-100 hover:bg-gray-200">
                <span className="font-medium">{role.toUpperCase()}</span>
                <span className="text-sm text-gray-600">{users.length.toString().padStart(2, "0")} ASSIGNED</span>
              </button>
              {users.length > 0 && (
                <div className="px-4 py-2 flex flex-wrap gap-2">
                  {users.map((user, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {user} <span className="text-gray-500">| User role</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
