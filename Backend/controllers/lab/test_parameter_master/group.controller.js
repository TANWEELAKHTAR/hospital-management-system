import Group from "../../../models/lab/test_parameter_master/group.model.js";
import TestParameter from "../../../models/lab/test_parameter_master/testParameter.model.js";

const addGroup = async (req, res) => {
    try {
        const { groupName, category, charges, parameters } = req.body;
        const clinicId = req.user.id;

        // Find if the group already exists
        let existingGroup = await Group.findOne({ groupName });

        if (existingGroup) {
            // Ensure parameters are valid
            if (parameters && parameters.length > 0) {
                const validParameters = await TestParameter.find({
                    _id: { $in: parameters },
                });

                if (validParameters.length !== parameters.length) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid TestParameter IDs provided",
                    });
                }

                // Add only new parameters (avoid duplicates)
                const newParams = parameters.filter(
                    (paramId) => !existingGroup.parameters.includes(paramId)
                );

                if (newParams.length > 0) {
                    existingGroup.parameters.push(...newParams);
                    await existingGroup.save();
                }

                return res.status(200).json({
                    success: true,
                    message: "Existing group updated with new parameters",
                    data: existingGroup,
                });
            }

            return res.status(400).json({
                success: false,
                message: "No new parameters provided",
            });
        }

        // If group does not exist, create a new one
        const newGroup = new Group({
            groupName,
            category,
            charges,
            parameters,
            clinicId,
        });

        await newGroup.save();

        return res.status(201).json({
            success: true,
            message: "Test Parameter Group added successfully",
            data: newGroup,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


const filterTestParameters = async (req, res) => {
    try {
        const {
            parameter,
            // category,
            // minRange,
            // maxRange,
            // unit,
            // method,
            page,
            limit,
        } = req.query;
        const clinicId= req.user.id
        let filter = {clinicId};

        // Apply filters based on query parameters
        if (parameter) filter.parameter = { $regex: parameter, $options: "i" }; // Case-insensitive search
        // if (category) filter.category = category;
        // if (unit) filter.unit = unit;
        // if (method) filter.method = method;

        // Filtering based on normal range (if both min & max are provided)
        // if (minRange && maxRange) {
        //     filter.normalRange = {
        //         $gte: parseFloat(minRange),
        //         $lte: parseFloat(maxRange),
        //     };
        // }

        // Pagination setup
        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        // Fetch data with filters, pagination
        const testParameters = await TestParameter.find(filter)
            .skip(skip)
            .limit(pageSize);

        // Count total matching records
        const totalRecords = await TestParameter.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Filtered test parameters retrieved successfully",
            data: testParameters,
            totalRecords,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalRecords / pageSize),
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the group by ID and populate the 'parameters' field
        const group = await Group.findById(id).populate("parameters");

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Group fetched successfully",
            data: group,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const allGroups = async (req, res) => {
    try {
        let { page, limit, search, category, minCharges, maxCharges } = req.query;
        const clinicId = req.user.id
        // Convert pagination parameters to numbers and set defaults
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // Create a filter object
        let filter = {clinicId};

        // Search by group name (case-insensitive)
        if (search) {
            filter.groupName = { $regex: search, $options: "i" };
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by charge range
        if (minCharges || maxCharges) {
            filter.charges = {};
            if (minCharges) filter.charges.$gte = parseFloat(minCharges);
            if (maxCharges) filter.charges.$lte = parseFloat(maxCharges);
        }

        // Fetch groups with applied filters, populate parameters, and apply pagination
        const groups = await Group.find(filter)
            .populate("parameters") // Populate parameter details
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sorting latest first

        // Count total documents that match the filter
        const totalGroups = await Group.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Groups fetched successfully",
            data: groups,
            pagination: {
                totalGroups,
                currentPage: page,
                totalPages: Math.ceil(totalGroups / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const editGroup = async (req, res) => {
    try {
        const { id } = req.params; // Group ID from request parameters
        const { groupName, category, charges, parameters } = req.body;

        // Find the group by ID
        let group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: "Group not found" 
            });
        }

        // Check if the group name already exists (excluding the current group)
        if (groupName && groupName !== group.groupName) {
            const existingGroup = await Group.findOne({ groupName });
            if (existingGroup) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Group name already exists" 
                });
            }
        }

        // Validate and update parameters (can add or remove)
        let updatedParameters = [];
        if (parameters) {
            // Ensure all provided parameters are valid
            const validParameters = await TestParameter.find({
                _id: { $in: parameters },
            });

            if (validParameters.length !== parameters.length) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid TestParameter IDs provided",
                });
            }

            updatedParameters = parameters; // Allow replacing the entire parameter list
        }

        // Update group fields
        group.groupName = groupName || group.groupName;
        group.category = category || group.category;
        group.charges = charges !== undefined ? charges : group.charges;
        group.parameters = updatedParameters; // Set new parameter list (can be empty)

        // Save changes
        await group.save();

        return res.status(200).json({
            success: true,
            message: "Test Parameter Group updated successfully",
            data: group,
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export {addGroup,filterTestParameters,getGroupById,allGroups,editGroup}