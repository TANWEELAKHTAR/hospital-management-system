import OtRequest from "../../../models/ot-scheduler/ot-schedule/otRequest.model.js";
import PatientAdmit from "../../../models/reception/patient_master/patientAdmit.model.js";
import OtMasters from "../../../models/ot-scheduler/ot-setup/ot-masters/otMasters.model.js";
import ClinicUser from "../../../models/clinicAdmin/userManagement/clinicUser.model.js";
import OtScheduled from "../../../models/ot-scheduler/ot-schedule/otScheduled.model.js";
import moment from "moment";

export const getPatients = async (req, res) => {
    try{
        const patients = await PatientAdmit.find({doctor : req.user.name, clinicId : req.user.id});
        res.status(200).json(patients);
    }
    catch(error){
        res.status(500).json(error);
    }
}

export const addOtRequest = async (req, res) => {
    try {
        const { preferredDate, preferredTime, forPatient, procedure } = req.body;
        const patient = await PatientAdmit.findOne({"patientDetails.name" : forPatient, doctor : req.user.name, clinicId : req.user.id});
        if(!patient){
            return res.status(400).json({message : "Patient not found"});
        }
        const otRequest = new OtRequest({
            ot : "-",
            preferredDate : new Date(preferredDate),
            preferredTime,
            patientDetails : {
                name : forPatient,
                age : patient.patientDetails?.age,
                gender : patient.patientDetails?.gender
            },
            procedure,
            requestedBy : req.user.name,
            status : "Pending",
            clinicId : req.user.id,
        });
        const savedOtRequest = await otRequest.save();
        res.status(200).json(savedOtRequest);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getOtRequestsDoctorwise = async (req, res) => {
    try {
        const otRequests = await OtRequest.find({clinicId : req.user.id, requestedBy : req.user.name});
        res.status(200).json(otRequests);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getOtRequests = async (req, res) => {
    try {
        const otRequests = await OtRequest.find({clinicId : req.user.id});
        res.status(200).json(otRequests);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const findAvailableOTs = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await OtRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "OT Request not found" });
        }

        const { preferredDate, preferredTime, clinicId } = request;

        const preferredMoment = moment(preferredDate).startOf("day");
        const endMoment = moment(preferredDate).add(7, "days").endOf("day");
        const preferredDay = preferredMoment.format("dddd");

        // Step 1: Get all OTs that operate on the preferred day
        const otMasters = await OtMasters.find({
            clinicId,
            status: "Active",
            timings: { $elemMatch: { day: preferredDay } }
        });

        const matchingOTs = [];
        const sameDayDifferentTimeOTs = [];
        const weekAvailableOTs = [];

        for (const ot of otMasters) {
            const timing = ot.timings.find(t => t.day === preferredDay);
            if (!timing) continue;

            // Check if already booked on preferredDate and preferredTime
            const alreadyBooked = await OtScheduled.findOne({
                ot: ot.identifier,
                date: preferredDate,
                time: preferredTime,
                clinicId
            });

            if (!alreadyBooked) {
                const preferredTimeMoment = moment(preferredTime, "HH:mm");
                const slotStart = moment(timing.inTime, "HH:mm");
                const slotEnd = moment(timing.outTime, "HH:mm");

                const isExactTimeMatch = preferredTimeMoment.isBetween(slotStart, slotEnd, null, "[)");

                if (isExactTimeMatch) {
                    matchingOTs.push({
                        otId: ot._id,
                        identifier: ot.identifier,
                        availableFrom: timing.inTime,
                        availableTo: timing.outTime,
                        date: preferredMoment.format("YYYY-MM-DD"),
                        day: preferredDay
                    });
                } else {
                    sameDayDifferentTimeOTs.push({
                        otId: ot._id,
                        identifier: ot.identifier,
                        availableFrom: timing.inTime,
                        availableTo: timing.outTime,
                        date: preferredMoment.format("YYYY-MM-DD"),
                        day: preferredDay
                    });
                }
            }
        }

        // Step 2: Check availability in next 7 days
        const allOtMasters = await OtMasters.find({ clinicId, status: "Active" });

        for (let i = 1; i <= 7; i++) {
            const date = moment(preferredDate).add(i, "days");
            const dayName = date.format("dddd");

            for (const ot of allOtMasters) {
                const timing = ot.timings.find(t => t.day === dayName);
                if (!timing) continue;

                const isBooked = await OtScheduled.exists({
                    ot: ot.identifier,
                    date: date.toDate(),
                    time: preferredTime,
                    clinicId
                });

                if (!isBooked) {
                    weekAvailableOTs.push({
                        otId: ot._id,
                        identifier: ot.identifier,
                        availableFrom: timing.inTime,
                        availableTo: timing.outTime,
                        date: date.format("YYYY-MM-DD"),
                        day: dayName
                    });
                }
            }
        }

        // Final Response
        if (matchingOTs.length > 0) {
            return res.json({
                status: "Exact match found",
                requestDetails : request,
                availableOTs: matchingOTs
            });
        } else {
            return res.json({
                status: "No exact match",
                requestDetails : request,   
                sameDayDifferentTimeOTs,
                weekAvailableOTs
            });
        }
    } catch (err) {
        console.error("Error checking OT availability:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const searchUser = async (req, res) => {
    try {
        const { query, role } = req.query;

        const searchConditions = {
            firstName: { $regex: query, $options: "i" },
            role : { $regex: role, $options: "i" },
            clinicId: req.user.id
        };

        const users = await ClinicUser.find(searchConditions)
            .select("_id firstName lastName department role phoneNumber");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const scheduleOT = async (req, res) => {
    try {
        const {
            ot,
            date,
            time,
            bookedBy,
            patientName,
            procedure,
            surgicalAssistant,
            scrubNurse,
            circulatingNurse,
            anesthetist,
            technician,
        } = req.body;

        const clinicId = req.user.id; 

        // Check if OT is already scheduled for this time and date
        const alreadyScheduled = await OtScheduled.findOne({ ot, date, time, clinicId });
        if (alreadyScheduled) {
            return res.status(400).json({ message: "OT already scheduled at this time." });
        }

        const newOtSchedule = new OtScheduled({
            ot,
            date,
            time,
            bookedBy,
            patientName,
            procedure,
            surgicalAssistant,
            scrubNurse,
            circulatingNurse,
            anesthetist,
            technician,
            clinicId
        });

        const savedSchedule = await newOtSchedule.save();

        res.status(201).json({
            message: "OT scheduled successfully",
            data: savedSchedule
        });
    } catch (error) {
        console.error("Error scheduling OT:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

