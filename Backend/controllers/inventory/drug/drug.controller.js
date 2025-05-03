import Drug from "../../../models/inventory/drug/drug.model.js";

export const createDrug = async (req, res) => {
    try {
        const { name, molecule, manufacturer, category, schedule, hsn, packing, weight, measurement, gst, mrp } = req.body;

        if (!name || !manufacturer || !category) {
            return res.status(400).json({ message: "Name, manufacturer, and category are required" });
        }

        // For development, use a hardcoded clinic ID if not available
        const clinicId = req.user.id || '123456789012345678901234';

        console.log('Creating drug with clinicId:', clinicId);

        const newDrug = new Drug({
            name,
            molecule,
            manufacturer,
            category,
            schedule,
            hsn,
            packing,
            weight,
            measurement,
            gst,
            mrp,
            clinicId: clinicId, // Ensure clinic ownership
        });

        await newDrug.save();
        res.status(201).json({ message: "Drug added successfully", drug: newDrug });

    } catch (error) {
        console.error('Error creating drug:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllDrugs = async (req, res) => {
    try {
        // For development, use a hardcoded clinic ID if not available
        const clinicId = req.user.id || '123456789012345678901234';
        console.log('Fetching drugs with clinicId:', clinicId);

        // Fetch all drugs for now during development
        const drugs = await Drug.find();
        console.log(`Found ${drugs.length} drugs`);

        res.status(200).json(drugs);
    } catch (error) {
        console.error('Error fetching drugs:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getDrugById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching drug with id:', id);

        // For development, don't filter by clinicId
        const drug = await Drug.findById(id);

        if (!drug) return res.status(404).json({ message: "Drug not found" });

        console.log('Found drug:', drug);
        res.status(200).json(drug);
    } catch (error) {
        console.error('Error fetching drug by id:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateDrug = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        console.log('Updating drug with id:', id);
        console.log('Update data:', updateData);

        // For development, don't filter by clinicId
        const drug = await Drug.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!drug) return res.status(404).json({ message: "Drug not found" });

        console.log('Updated drug:', drug);
        res.status(200).json({ message: "Drug updated successfully", drug });
    } catch (error) {
        console.error('Error updating drug:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteDrug = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting drug with id:', id);

        // For development, don't filter by clinicId
        const drug = await Drug.findByIdAndDelete(id);

        if (!drug) return res.status(404).json({ message: "Drug not found" });

        console.log('Deleted drug:', drug);
        res.status(200).json({ message: "Drug deleted successfully" });
    } catch (error) {
        console.error('Error deleting drug:', error);
        res.status(500).json({ message: error.message });
    }
};
