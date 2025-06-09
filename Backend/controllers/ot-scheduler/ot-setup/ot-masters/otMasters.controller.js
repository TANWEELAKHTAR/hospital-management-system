import OtMasters from "../../../../models/ot-scheduler/ot-setup/ot-masters/otMasters.model.js";

export const createOtMaster = async (req, res) => {
    try {
      const { identifier, type, capacity, status, equipment, timings } = req.body;
      const clinicId = req.user.id;
  
      const otMaster = new OtMasters({
        clinicId,
        identifier,
        type,
        capacity,
        status,
        equipment,
        timings,
      });
  
      await otMaster.save();
      res.status(201).json({ message: "OT Master created successfully", otMaster });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getAllOtMasters = async (req, res) => {
    try {
      const clinicId = req.user.id;
      const otMasters = await OtMasters.find({ clinicId });
      res.status(200).json({ otMasters });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getOtMasterById = async (req, res) => {
    try {
      const { id } = req.params;
      const clinicId = req.user.id;
  
      const otMaster = await OtMasters.findOne({ _id: id, clinicId });
  
      if (!otMaster) {
        return res.status(404).json({ message: "OT Master not found" });
      }
  
      res.status(200).json({ otMaster });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const updateOtMaster = async (req, res) => {
    try {
      const { id } = req.params;
      const clinicId = req.user.id;
  
      const updated = await OtMasters.findOneAndUpdate(
        { _id: id, clinicId },
        req.body,
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: "OT Master not found or not updated" });
      }
  
      res.status(200).json({ message: "OT Master updated", updated });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const deleteOtMaster = async (req, res) => {
    try {
      const { id } = req.params;
      const clinicId = req.user.id;
  
      const deleted = await OtMasters.findOneAndDelete({ _id: id, clinicId });
  
      if (!deleted) {
        return res.status(404).json({ message: "OT Master not found or not deleted" });
      }
  
      res.status(200).json({ message: "OT Master deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  