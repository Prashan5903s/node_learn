const User = require('../../model/User');
const Zone = require('../../model/Zone');
const validation = require('../../util/validation')
const { ObjectId } = require('mongoose').Types;
const { successResponse, errorResponse, warningResponse } = require('../../util/response')

exports.getRegionAPI = async (req, res, next) => {
    const userId = req.userId;
    const zone = await Zone.find({ created_by: userId });
    let allRegions = [];
    zone.forEach(item => {
        item.region.forEach(data => {
            allRegions.push({ data, zoneId: item._id });
        })
    })

    res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data fetched successfully!",
        data: allRegions,
    })

}

exports.createRegionAPI = async (req, res, next) => {
    try {
        const userId = req.userId;
        const data = await Zone.find({ created_by: userId }).select('id name');
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Data fetched successfully",
            data
        })
    } catch (error) {

        next(error);
    }
}

exports.postRegionAPI = async (req, res, next) => {
    try {
        if (!validation(req, res)) return;

        const { region, zone_id } = req.body;
        const userId = req.userId;

        const zone = await Zone.findOne({ created_by: userId, _id: zone_id });

        if (!zone) {
            return res.status(404).json({
                status: "Fail",
                statusCode: 404,
                message: "Zone not found or not authorized."
            });
        }

        res.status(200).json({
            region,
            zone_id
        });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "Fail",
                statusCode: 404,
                message: "User not found."
            });
        }

        let regions = [];

        if (Array.isArray(region) && region.length > 0) {
            for (const item of region) {
                regions.push({
                    name: item.name,
                    created_by: userId,
                    company_id: user.company_id,
                    master_company_id: user.master_company_id,
                    parent_company_id: user.parent_company_id
                });
            }
        }

        await zone.addRegion(regions);

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: 'Regions added successfully!',
        });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: "Internal server error"
        });
    }
};

exports.postRegionDataAPI = async (req, res, next) => {
    try {
        const userId = req.userId; // assuming req.user contains the full user object
        const user = await User.findById(userId);
        const { name, zoneId } = req.body;

        const zone = await Zone.findOne({ created_by: user._id, _id: zoneId });

        if (!zone) {
            return errorResponse(res, "Zone does not exist", {}, 404);
        }

        // Push new region
        zone.region.push({
            name,
            created_by: user._id,
            company_id: user.company_id,
            master_company_id: user.master_company_id,
            parent_company_id: user.parent_company_id
        });

        await zone.save();

        return successResponse(res, "Region added successfully", zone); // optionally return the zone or region

    } catch (error) {
        next(error);
    }
};

exports.putRegionData = async (req, res, next) => {

    try {

        const successMessage = successResponse(res, "Region updated successfully");

        const userId = req.userId;
        const regionId = req.params.id;
        const { name, zoneId } = req.body;

        // Find the zone created by the user
        const zone = await Zone.findOne({ created_by: userId, _id: zoneId });

        if (!zone) {
            return errorResponse(res, "Zone does not exist", {}, 404);
        }

        // // Find the region by ID within the zone's region array
        const regionIndex = zone.region.findIndex(r => r._id.toString() === regionId);

        if (regionIndex === -1) {

            //Find the old zone containing this region
            const oldZone = await Zone.findOne({ 'region._id': new ObjectId(regionId) });
            if (!oldZone) {
                return res.status(404).json({ message: 'Region not found in any zone' });
            }

            //Extract the region to be moved
            const regionToMove = oldZone.region.find(r => r._id.toString() === regionId);
            if (!regionToMove) {
                return res.status(404).json({ message: 'Region not found in old zone' });
            }

            //Remove region from old zone
            oldZone.region = oldZone.region.filter(r => r._id.toString() !== regionId);
            await oldZone.save();

            //Add region to new zone
            const newZone = await Zone.findById(zoneId);
            if (!newZone) {
                return res.status(404).json({ message: 'Target zone not found' });
            }

            newZone.region.push(regionToMove);
            await newZone.save();

            return successMessage;

        }

        // Update the name
        zone.region[regionIndex].name = name;

        // Save the updated zone
        await zone.save();

        return successMessage;

    } catch (error) {
        next(error)
    }
}
