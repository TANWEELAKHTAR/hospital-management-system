import EquipmentMaster from "../../../../models/ot-scheduler/ot-setup/equipment-master/equipment-master.model.js";

export const createEquipment = async (req, res) => {
    try {
      const { equipmentName, description, assignTo, status } = req.body;
  
      if (!equipmentName || !status) {
        return res.status(400).json({ message: "Equipment name and status are required." });
      }
  
      const newEquipment = new EquipmentMaster({
        equipmentName,
        description,
        assignTo,
        status,
        clinicId: req.user.id,
      });
  
      await newEquipment.save();
      res.status(201).json({ message: "Equipment created successfully", equipment: newEquipment });
    } catch (error) {
      console.error("Error in createEquipment:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const getAllEquipments = async (req, res) => {
    try {
      const equipments = await EquipmentMaster.find({ clinicId: req.user.id }).sort({ equipmentName: 1 });
      res.status(200).json({ equipments });
    } catch (error) {
      console.error("Error in getAllEquipments:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const getEquipmentById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const equipment = await EquipmentMaster.findById({
        _id: id,
        clinicId: req.user.id,
      });
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
  
      res.status(200).json({ equipment });
    } catch (error) {
      console.error("Error in getEquipmentById:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const updateEquipment = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      const updatedEquipment = await EquipmentMaster.findByIdAndUpdate({
        _id: id,
        clinicId: req.user.id,
      }, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
  
      res.status(200).json({ message: "Equipment updated", equipment: updatedEquipment });
    } catch (error) {
      console.error("Error in updateEquipment:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const deleteEquipment = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await EquipmentMaster.findByIdAndDelete({
        _id: id,
        clinicId: req.user.id,
      });
      if (!deleted) {
        return res.status(404).json({ message: "Equipment not found" });
      }
  
      res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
      console.error("Error in deleteEquipment:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  