import Drug from "../../../models/inventory/drug/drug.model.js";

export const createDrug = async (req, res) => {
    try {
        const { name, molecule, manufacturer, category, refundableMaterial, schedule, hsn, packing, weight, measurement, gst, mrp } = req.body;

        if (!name || !manufacturer || !category) {
            return res.status(400).json({ message: "Name, manufacturer, and category are required" });
        }

        const newDrug = new Drug({
            name,
            molecule,
            manufacturer,
            category,
            refundableMaterial,
            schedule,
            hsn,
            packing,
            weight,
            measurement,
            gst,
            mrp,
            clinicId: req.user.id, // Ensure clinic ownership
        });

        await newDrug.save();
        res.status(201).json({ message: "Drug added successfully", drug: newDrug });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllDrugs = async (req, res) => {
    try {
        const drugs = await Drug.find({ clinicId: req.user.id }); // Fetch drugs for clinic only
        res.status(200).json(drugs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDrugById = async (req, res) => {
    try {
        const { id } = req.params;

        const drug = await Drug.findOne({ _id: id, clinicId: req.user.id });

        if (!drug) return res.status(404).json({ message: "Drug not found" });

        res.status(200).json(drug);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDrug = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const drug = await Drug.findOneAndUpdate(
            { _id: id, clinicId: req.user.id },
            updateData,
            { new: true }
        );

        if (!drug) return res.status(404).json({ message: "Drug not found" });

        res.status(200).json({ message: "Drug updated successfully", drug });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDrug = async (req, res) => {
    try {
        const { id } = req.params;

        const drug = await Drug.findOneAndDelete({ _id: id, clinicId: req.user.id });

        if (!drug) return res.status(404).json({ message: "Drug not found" });

        res.status(200).json({ message: "Drug deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
