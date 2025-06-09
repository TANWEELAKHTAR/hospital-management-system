import AppointmentBill from "../../../models/billing/appointmentBill/appointmentBill.model.js";
import Appointment from "../../../models/reception/patient_master/patientAppointment.model.js";
import InvoiceNumber from "../../../models/superAdmin/invoiceNumber.model.js";
import Patient from "../../../models/reception/new_patient_reg/newPatient.model.js";
import Clinic from "../../../models/superAdmin/clinic.model.js";
import ConsultationPrint from "../../../models/clinicAdmin/masterDataConfig/printSettings/consultationPrint/consultationPrint.model.js";
import Doctor from "../../../models/clinicAdmin/masterDataConfig/doctor/doctor.model.js";

export const generateAppointmentInvoice = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const clinicId = req.user.id; // Assuming user is clinic admin

        // Fetch appointment bill details
        const appointment = await Appointment.findOne({ _id : appointmentId,clinicId : clinicId});
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Fetch clinic details
        const clinic = await Clinic.findById(clinicId);
        if (!clinic) {
            return res.status(404).json({ message: "Clinic not found" });
        }

        // Fetch invoice details
        const invoice = await InvoiceNumber.findOne({ clinicId });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice details not found" });
        }

        // Fetch patient details

        const patient = await Patient.findOne({ _id : appointment.patientId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Fetch invoice design settings
        const printSettings = await ConsultationPrint.findOne({ clinicId });
        if (!printSettings) {
            return res.status(404).json({ message: "Print settings not found" });
        }

        // Extract settings
        const { fontSize, spaceBetweenLines } = printSettings.basicSettings;
        const { type: headerType, text: headerText, imageUrl: headerImage } = printSettings.bannerHeading.headerBanner;
        const { type: footerType, text: footerText, imageUrl: footerImage } = printSettings.footerBanner.footerBanner;

        const doctor = await Doctor.findOne({ _id: appointment.doctorId, clinicId: req.user.id });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        // Calculate amounts
        const totalAmount = parseFloat(doctor.consultationFee);
        const discount = 100.00;
        const gst = 0.18 * totalAmount;
        const payableAmount = totalAmount - discount + gst;

        const appointmentBill = new AppointmentBill({
            mrn: patient.mrn,
            clinicDetails: {
                name: clinic.clinicName,
                email: clinic.email,
                address: clinic.address,
                phone: clinic.phone_number,
            },
            invoiceDetails: {
                invoiceNumber: invoice.invoiceNumber,
                date: new Date(),
                type: "Appointment",
            },
            patientDetails: {
                name: patient.givenName + " " + patient.middleName + " " + patient.familyName,
                age: patient.age,
                gender: patient.gender,
                mrn: patient.mrn,
            },
            doctorDetails : {
                name : doctor.name,
                consultationFee : doctor.consultationFee,
            },
            billDetails : {
                total : totalAmount,
                discount : discount,
                gst : gst,
                payableAmount : payableAmount
            }
        });

        // Save appointment bill
        const bill = await appointmentBill.save();

        const newInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
            { clinicId },
            { $inc: { invoiceNumber: 1 } },
            { new: true }
        );
        newInvoiceNumber.save();
        
        res.status(200).send({
            message: "Successfully added bill",
            printSettings : printSettings,
            bill : bill,
        }); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
