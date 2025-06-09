import TestParameter from "../../../models/lab/test_parameter_master/testParameter.model.js"; // Adjust path as needed

const addOrUpdateTestParameter = async (req, res) => {
    try {
        const { parameter, category, unit, method, normalRanges } = req.body;

        if (!parameter || !category || !unit || !method || !normalRanges) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required." });
        }
        const clinicId = req.user.id;
        // Find the existing test parameter
        let existingTestParameter = await TestParameter.findOne({
            parameter,
            category,
            unit,
            method,
            clinicId,
        });

        if (existingTestParameter) {
            // Append new normal ranges while avoiding duplicates
            normalRanges.forEach((newRange) => {
                const exists = existingTestParameter.normalRanges.some(
                    (range) =>
                        range.gender === newRange.gender &&
                        range.specialCondition === newRange.specialCondition &&
                        range.age === newRange.age
                );

                if (!exists) {
                    existingTestParameter.normalRanges.push(newRange);
                }
            });

            // Save updated document
            await existingTestParameter.save();
            return res.status(200).json({
                success: true,
                message: "Test parameter updated successfully.",
                data: existingTestParameter,
            });
        } else {
            // Create a new test parameter
            const newTestParameter = new TestParameter({
                parameter,
                category,
                unit,
                method,
                normalRanges,
                clinicId,
            });

            const savedParameter = await newTestParameter.save();
            return res.status(201).json({
                success: true,
                message: "Test parameter added successfully.",
                data: savedParameter,
            });
        }
    } catch (error) {
        console.error("Error adding/updating test parameter:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const allTestParameters = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, unit, parameter } = req.query;
        const clinicId= req.user.id
        const filters = {clinicId};
        if (category) filters.category = category;
        if (unit) filters.unit = unit;

        // Search for matching parameter names
        if (parameter) {
            filters.parameter = { $regex: parameter, $options: "i" }; // Case-insensitive search
        }

        const total = await TestParameter.countDocuments(filters);
        const testParameters = await TestParameter.find(filters)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            message: "Test parameters fetched successfully.",
            total,
            page: Number(page),
            limit: Number(limit),
            data: testParameters,
        });
    } catch (error) {
        console.error("Error fetching test parameters:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const editTestParameter = async (req, res) => {
    try {
        const { id } = req.params;
        const { parameter, category, unit, method, normalRanges } = req.body;

        // Find existing test parameter
        const testParameter = await TestParameter.findById(id);
        if (!testParameter) {
            return res
                .status(404)
                .json({ success: false, message: "Test parameter not found" });
        }

        // Update fields
        if (parameter) testParameter.parameter = parameter;
        if (category) testParameter.category = category;
        if (unit) testParameter.unit = unit;
        if (method) testParameter.method = method;

        // Update normal ranges (overwrite existing with new ones)
        if (normalRanges && Array.isArray(normalRanges)) {
            testParameter.normalRanges = normalRanges;
        }

        // Save the updated document
        await testParameter.save();

        return res.status(200).json({
            success: true,
            message: "Test parameter updated successfully",
            data: testParameter,
        });
    } catch (error) {
        console.error("Error updating test parameter:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const getTestParameter = async (req, res) => {
    try {
        const { id } = req.params;

        const testParameter = await TestParameter.findById(id);
        if (!testParameter) {
            return res
                .status(404)
                .json({ success: false, message: "Test parameter not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Test parameter fetched successfully.",
            data: testParameter,
        });
    } catch (error) {
        console.error("Error fetching test parameter:", error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            });
    }
};

export {
    addOrUpdateTestParameter,
    allTestParameters,
    editTestParameter,
    getTestParameter,
};
