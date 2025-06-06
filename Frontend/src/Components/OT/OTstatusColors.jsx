import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const data = [
  {
    patient: "Manoj Kumar",
    procedure: "Laparoscopic Cholecystectomy",
    requestedBy: "Dr. Rajendra Prasad",
    anesthetist: "-",
    date: "12/05/2025, 20:30",
    status: "New Request"
  },
  {
    patient: "Pramod Kumar",
    procedure: "Open Cholecystectomy",
    requestedBy: "Dr. Maneesh Paul",
    anesthetist: "-",
    date: "21/05/2025, 20:30",
    status: "New Request"
  },
  {
    patient: "Preveshtha Sharma",
    procedure: "Percutaneous Cholecystostomy",
    requestedBy: "Dr. Meera Rathore",
    anesthetist: "Suresh Patel",
    date: "30/05/2025, 20:30",
    status: "Time suggested"
  },
  // ... add other data similarly
];

const statusColors = {
  "New Request": "bg-green-100 text-green-800",
  "Time suggested": "bg-orange-100 text-orange-800",
  "In-Progress": "bg-yellow-100 text-yellow-800",
  "OT unavailable": "bg-red-100 text-red-800"
};

export default function OTScheduler() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">OT schedule</h1>

      <div className="flex gap-2 items-center">
        <Input placeholder="Search" className="w-64" />
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Procedure</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Anesthetist</TableHead>
                <TableHead>Preferred Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.patient}</TableCell>
                  <TableCell>{row.procedure}</TableCell>
                  <TableCell>{row.requestedBy}</TableCell>
                  <TableCell>{row.anesthetist}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[row.status] || "bg-gray-100 text-gray-800"}`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" className="text-blue-600">Book OT</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <span className="text-sm">Page 1 of 30</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <Button key={page} variant={page === 1 ? "default" : "outline"} size="sm">
              {page}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
