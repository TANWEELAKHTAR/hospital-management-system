import express from "express";
import clinicRouter from "./routes/superAdmin/clinic.route.js";
import adminRouter from "./routes/superAdmin/admin.route.js";
import clinicAdminRouter from "./routes/clinicAdmin/userManagement/clinicAdmin.route.js";
import departmentRouter from "./routes/clinicAdmin/masterDataConfig/department/department.route.js";
import connectDB from "./config/dbConnect.js";
import cors from "cors";
import "dotenv/config";
import serviceRouter from "./routes/clinicAdmin/masterDataConfig/service/service.route.js";
import doctorRouter from "./routes/clinicAdmin/masterDataConfig/doctor/doctor.route.js";
import bedRouter from "./routes/clinicAdmin/masterDataConfig/bed/bed.route.js";
import tariffRouter from "./routes/clinicAdmin/masterDataConfig/tariff/tariff.route.js";
import templateRouter from "./routes/clinicAdmin/masterDataConfig/template/template.route.js";
import wardRouter from "./routes/clinicAdmin/masterDataConfig/bed/ward.route.js";
import roomRouter from "./routes/clinicAdmin/masterDataConfig/bed/room.route.js";
import referralRouter from "./routes/reception/referral/referral.route.js";
import loginRouter from "./routes/login.router.js";
import newPatientRouter from "./routes/reception/new_patient_reg/newPatient.route.js";
import patientAdmitRouter from "./routes/reception/patient_master/patientAdmit.route.js";
import patientServiceRouter from "./routes/reception/services/patientService.route.js";
import patientAppointmentRouter from "./routes/reception/patient_master/patientAppointment.route.js";
import manufacturerRouter from "./routes/inventory/manufacturer_data/manufacturer.route.js";
import supplierRouter from "./routes/inventory/supplier_data/supplier.route.js";
import drugRouter from "./routes/inventory/drug/drug.route.js";
import stockEntryRouter from "./routes/inventory/stockEntry/stockEntry.route.js";
import opQueueRouter from "./routes/doctor/OPQueue/opQueue.route.js";
import consultationPrintRouter from "./routes/clinicAdmin/masterDataConfig/printSettings/consultationPrint/consultationPrint.route.js";
import pharmacyBillRouter from "./routes/clinicAdmin/masterDataConfig/printSettings/pharmacyBill/pharmacyBill.route.js";
import billReceiptRouter from "./routes/clinicAdmin/masterDataConfig/printSettings/billReceipt/billReceipt.route.js";
import doctorPrescriptionRouter from "./routes/clinicAdmin/masterDataConfig/printSettings/doctorPrescription/doctorPrescription.route.js";
import labReportRouter from "./routes/clinicAdmin/masterDataConfig/printSettings/labReports/labReport.route.js";
import appointmentBillRouter from "./routes/billing/appointmentBill/appointmentBill.route.js";
// import testParameterRouter from "./routes/lab/test_parameter_master/testParameter.route.js";
// import groupRouter from "./routes/lab/test_parameter_master/group.route.js";
import unregisteredPatientRouter from "./routes/pharmacy/unregistered_patient/unregisteredPatient.route.js";
import stockAdjustmentRouter from "./routes/inventory/stock_adjustment/stockAdjustment.route.js";
import stockMigrationRouter from "./routes/inventory/stockMigration/stockMigration.route.js";
import ipDashboardRouter from "./routes/doctor/Ip_dashboard/ipDashboard.route.js";
import opPrescriptionRouter from "./routes/pharmacy/op_prescription/opPrescription.route.js";
import returnsRouter from "./routes/pharmacy/returns/returns.route.js";
import equipmentMasterRouter from "./routes/ot-scheduler/ot-setup/equipment-master/equipment-master.route.js";
import otMastersRouter from "./routes/ot-scheduler/ot-setup/ot-masters/otMasters.route.js";
import otRequestRouter from "./routes/ot-scheduler/ot-schedule/otRequest.route.js";
import otScheduledRouter from "./routes/ot-scheduler/ot-schedule/otScheduled.route.js";
import completedCasesRouter from "./routes/ot-scheduler/completed-cases/completedCases.route.js";
const app = express();

const PORT = 4000 || process.env.PORT;

app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/clinic", clinicRouter);
app.use("/api/admin", adminRouter);
app.use("/api/clinicAdmin", clinicAdminRouter);
app.use("/api/clinicAdmin/masterDataConfig/department", departmentRouter);
app.use("/api/clinicAdmin/masterDataConfig/service", serviceRouter);
app.use("/api/ClinicAdmin/masterDataConfig/doctor", doctorRouter);
app.use("/api/ClinicAdmin/masterDataConfig/bed", bedRouter);
app.use("/api/clinicAdmin/masterDataConfig/tariff", tariffRouter);
app.use("/api/clinicAdmin/masterDataConfig/template", templateRouter);
app.use("/api/clinicAdmin/masterDataConfig/ward", wardRouter);
app.use("/api/clinicAdmin/masterDataConfig/room", roomRouter);
app.use("/api/clinicAdmin/masterDataConfig/print-settings/consultation-print", consultationPrintRouter)
app.use("/api/clinicAdmin/masterDataConfig/print-settings/pharmacy-bill", pharmacyBillRouter)
app.use("/api/clinicAdmin/masterDataConfig/print-settings/bill-receipt", billReceiptRouter);
app.use("/api/clinicAdmin/masterDataConfig/print-settings/doctor-prescription", doctorPrescriptionRouter );
app.use("/api/clinicAdmin/masterDataConfig/print-settings/lab-report", labReportRouter);
app.use("/api/login", loginRouter);
app.use("/api/receptionist/referral", referralRouter);
app.use("/api/receptionist/patient", newPatientRouter);
app.use("/api/receptionist/patientMaster/admit", patientAdmitRouter);
app.use("/api/receptionist/patientMaster/appointment",patientAppointmentRouter);
app.use("/api/receptionist/service",patientServiceRouter)
app.use("/api/inventory/manufacturer", manufacturerRouter);
app.use("/api/inventory/supplier",supplierRouter)
app.use("/api/inventory/drug", drugRouter)
app.use("/api/inventory/stock-entry", stockEntryRouter)
app.use("/api/inventory/stock-adjustment", stockAdjustmentRouter)
app.use("/api/inventory/stock-migration", stockMigrationRouter)
app.use("/api/doctor/op-queue", opQueueRouter)
app.use("/api/doctor/ip-dashboard",ipDashboardRouter)
app.use("/api/billing/appointment-bill", appointmentBillRouter);
// app.use("/api/lab/testParameterMaster",testParameterRouter)
// app.use("/api/lab/groups",groupRouter )
app.use("/api/pharmacy/unregisteredPatient",unregisteredPatientRouter)
app.use("/api/pharmacy/op-prescription", opPrescriptionRouter)
app.use("/api/pharmacy/return", returnsRouter)
app.use("/api/ot-scheduler/ot-setup/equipment-master", equipmentMasterRouter);
app.use("/api/ot-scheduler/ot-setup/ot-masters", otMastersRouter);
app.use("/api/ot-scheduler/ot-schedule/ot-request", otRequestRouter);
app.use("/api/ot-scheduler/ot-schedule/ot-scheduled", otScheduledRouter);
app.use("/api/ot-scheduler/completed-cases", completedCasesRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
