import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const equipmentData = [
  {
    name: "ECG monitor",
    description: "Displays the electrical activity of the heart in real-time...",
    assignedTo: "OT-1, OT-2, OT-3 OT-4",
    status: "Active",
  },
  {
    name: "Pulse oximeter",
    description: "Measures the oxygen saturation level (SpO₂) in the bl...",
    assignedTo: "OT-1, OT-2, OT-3 OT-4, +4",
    status: "Inactive",
  },
  // Add the rest of the equipment rows similarly...
];

export default function EquipmentMaster() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-semibold">Equipment master</div>
        <Button>Add Equipment</Button>
      </div>

      <div className="mb-4 flex gap-4">
        <Input placeholder="Search" className="max-w-sm" />
        <Button variant="outline">Filter</Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 bg-muted p-4 font-semibold">
          <div>Equipment Name</div>
          <div>Description</div>
          <div>Assigned To</div>
          <div>Status</div>
        </div>
        {equipmentData.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "grid grid-cols-4 p-4 border-t",
              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
            )}
          >
            <div>{item.name}</div>
            <div>{item.description}</div>
            <div>{item.assignedTo}</div>
            <div>
              <Badge variant={item.status === "Active" ? "success" : "destructive"}>
                {item.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">Page 1 of 30</div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "ghost"}
              className="px-3 py-1 text-sm"
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
