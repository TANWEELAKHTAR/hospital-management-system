import OtScheduled from "../../../models/ot-scheduler/ot-schedule/otScheduled.model.js";
import moment from "moment"

export const getOtSchedules = async (req, res) => {
    try {
        const todayStart = moment().startOf("day").toDate();

        const otSchedules = await OtScheduled.find({
            clinicId: req.user.id,
            date: { $gte: todayStart },
            status : { $eq : "Scheduled" }
        });

        res.status(200).json(otSchedules);
    } catch (error) {
        console.error("Error fetching OT schedules:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateOtSchedule = async (req, res) => {
    try {
        const { id } = req.params; // Schedule ID to update
        const clinicId = req.user.id; // Clinic context

        // Fetch the existing schedule
        const existingSchedule = await OtScheduled.findOne({ _id: id, clinicId });
        if (!existingSchedule) {
            return res.status(404).json({ message: "OT Schedule not found" });
        }

        const { ot, date, time } = req.body;

        // If the user is updating the OT, date, or time, check for conflicts
        if ((ot && date && time) && 
            (ot !== existingSchedule.ot || date !== existingSchedule.date.toISOString().split("T")[0] || time !== existingSchedule.time)) {
            const conflict = await OtScheduled.findOne({ 
                ot, 
                date: new Date(date), 
                time, 
                clinicId, 
                _id: { $ne: id } // exclude current schedule
            });

            if (conflict) {
                return res.status(400).json({ message: "Another OT is already scheduled at this time." });
            }
        }

        // Update fields (only what's provided)
        Object.assign(existingSchedule, req.body);
        const updated = await existingSchedule.save();

        res.status(200).json({
            message: "OT schedule updated successfully",
            data: updated
        });
    } catch (error) {
        console.error("Error updating OT schedule:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const completeOtCase = async (req, res) => {
    try {
        const { id } = req.params; // OT schedule ID
        const {
            inTime,
            outTime,
            completedOn,
            outcome,
            additionNote,
            patientStatus
        } = req.body;

        const updatedSchedule = await OtScheduled.findOneAndUpdate(
            { _id: id, clinicId: req.user.id },
            {
                $set: {
                    status: "Completed",
                    caseCompletionDetails: {
                        inTime,
                        outTime,
                        completedOn,
                        outcome,
                        additionNote,
                        patientStatus
                    }
                }
            },
            { new: true }
        );

        if (!updatedSchedule) {
            return res.status(404).json({ message: "OT Schedule not found" });
        }

        res.status(200).json({
            message: "Case marked as completed successfully",
            data: updatedSchedule
        });

    } catch (error) {
        console.error("Error updating case completion details:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};