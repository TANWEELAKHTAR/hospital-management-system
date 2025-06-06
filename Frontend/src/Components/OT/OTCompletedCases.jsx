import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

const data = [
  {
    name: "Manoj Kumar | 26y | M",
    scheduled: "12/05/2025; 20:30",
    completed: "20:30",
    doctor: "Dr. Rajendra Prasad",
    anesthetist: "Suresh Patel",
    procedure: "Laparoscopic Cholecystectomy",
  },
  {
    name: "Pramod Kumar | 32y | M",
    scheduled: "21/05/2025; 20:30",
    completed: "08:00",
    doctor: "Dr. Maneesh Paul",
    anesthetist: "Suresh Patel",
    procedure: "Open Cholecystectomy",
  },
  // Add the rest of the data entries similarly...
];

export default function CompletedCases() {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Completed cases</h2>
        <div className="flex gap-2">
          <Input placeholder="Search" className="w-64" />
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">NAME, AGE, SEX</th>
              <th className="p-2">SCHEDULED ON</th>
              <th className="p-2">COMPLETED TIME</th>
              <th className="p-2">DOCTOR</th>
              <th className="p-2">ANESTHETIST</th>
              <th className="p-2">PROCEDURE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{row.name}</td>
                <td className="p-2">{row.scheduled}</td>
                <td className="p-2">{row.completed}</td>
                <td className="p-2">{row.doctor}</td>
                <td className="p-2">{row.anesthetist}</td>
                <td className="p-2 truncate max-w-xs">{row.procedure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">Page 1 of 30</span>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
            >
              {page}
            </Button>
          ))}
          <Button variant="ghost" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
