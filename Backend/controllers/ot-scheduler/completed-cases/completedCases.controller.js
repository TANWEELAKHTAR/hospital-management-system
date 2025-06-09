import OtScheduled from "../../../models/ot-scheduler/ot-schedule/otScheduled.model.js";

export const getCompletedCases = async (req, res) => {
    try {
        const completedCases = await OtScheduled.find({ status: "Completed", clinicId: req.user.id });
        res.status(200).json(completedCases);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getCompletedCasesById = async (req,res)=>{
    try {
        const {id} = req.params;
        const completedCase = await OtScheduled.findOne({ _id: id, status: "Completed", clinicId: req.user.id });
        res.status(200).json(completedCase);
    } catch (error) {
        res.status(500).json(error);
    }
}

//An extra api if needed ( not used in the design as of now )
export const getCompletedCasesByDate = async (req,res)=>{
    try {
        const {date} = req.params;
        const completedCase = await OtScheduled.find({ date: date, status: "Completed", clinicId: req.user.id });
        res.status(200).json(completedCase);
    } catch (error) {
        res.status(500).json(error);
    }
}