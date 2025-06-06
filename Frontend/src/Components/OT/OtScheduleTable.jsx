import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const otData = [
  {
    ot: "OT - 01",
    name: "Manoj Kumar | 26y | M",
    datetime: "12/05/2025, 20:30",
    doctor: "Dr. Rajendra Prasad",
    anesthetist: "Suresh Patel",
    procedure: "Laparoscopic Cholecystectomy"
  },
  {
    ot: "OT - 01",
    name: "Pramod Kumar | 32y | M",
    datetime: "21/05/2025, 20:30",
    doctor: "Dr. Maneesh Paul",
    anesthetist: "Suresh Patel",
    procedure: "Open Cholecystectomy"
  },
  {
    ot: "OT - 01",
    name: "Preveshna Sharma | 4m | F",
    datetime: "30/05/2025, 20:30",
    doctor: "Dr. Meera Rathore",
    anesthetist: "Suresh Patel",
    procedure: "Percutaneous Cholecystostomy"
  },
  {
    ot: "OT - 01",
    name: "Sita Patel | 12y | F",
    datetime: "05/06/2025, 20:30",
    doctor: "Dr. Anjali Verma",
    anesthetist: "Neha Sharma",
    procedure: "Endoscopic Retrograde Cholangiopancreatography"
  },
  {
    ot: "OT - 01",
    name: "Anita Desai | 45y | F",
    datetime: "15/06/2025, 20:30",
    doctor: "Dr. Kunal Kapoor",
    anesthetist: "Vikram Singh",
    procedure: "Cholecystectomy with bile duct exploration"
  },
  {
    ot: "OT - 01",
    name: "Rajesh Singh | 29y | M",
    datetime: "25/06/2025, 20:30",
    doctor: "Dr. Priya Singh",
    anesthetist: "Deepa Joshi",
    procedure: "Robotic-Assisted Cholecystectomy"
  },
  {
    ot: "OT - 01",
    name: "Neha Verma | 22y | F",
    datetime: "04/07/2025, 20:30",
    doctor: "Dr. Rohan Joshi",
    anesthetist: "Rahul Mehta",
    procedure: "Transoral Approaches to Cholecystectomy"
  },
  {
    ot: "OT - 01",
    name: "Vikram Reddy | 35y | M",
    datetime: "15/07/2025, 20:30",
    doctor: "Dr. Sneha Mehta",
    anesthetist: "Riya Kapoor",
    procedure: "Single-Incision Laparoscopic Surgery"
  },
  {
    ot: "OT - 01",
    name: "Riya Mehta | 18y | F",
    datetime: "25/07/2025, 20:30",
    doctor: "Dr. Vikram Desai",
    anesthetist: "Amit Kumar",
    procedure: "Laparoscopic Common Bile Duct Exploration"
  },
  {
    ot: "OT - 01",
    name: "Arjun Thakur | 40y | M",
    datetime: "01/08/2025, 20:30",
    doctor: "Dr. Aditi Sharma",
    anesthetist: "Sneha Iyer",
    procedure: "Mini-Laparoscopic Cholecystectomy"
  }
];

export default function OtScheduleTable() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">OT Schedule</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="space-x-4">
          <span className="text-blue-600 font-medium">Scheduled</span>
        </div>
        <div className="flex gap-2">
          <Input type="text" placeholder="Search" className="w-64" />
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>OT</TableHead>
                <TableHead>Name, Age, Sex</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Anesthetist</TableHead>
                <TableHead>Procedure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.ot}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.datetime}</TableCell>
                  <TableCell>{row.doctor}</TableCell>
                  <TableCell>{row.anesthetist}</TableCell>
                  <TableCell>{row.procedure}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-600">Page 1 of 30</span>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline"><ChevronLeft className="h-4 w-4" /></Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="icon"
            >
              {page}
            </Button>
          ))}
          <Button size="icon" variant="outline"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
