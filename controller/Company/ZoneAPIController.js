const Zone = require('../../model/Zone');
const User = require('../../model/User');
const validation = require('../../util/validation')

exports.getZoneAPIData = async (req, res, next) => {
    try {

        const userId = req.userId;

        const data = await Zone.find({ created_by: userId });

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Data fetched successfully!",
            data
        })

    } catch (error) {
        console.error("Error occured", error);
    }
}

exports.postZoneAPI = async (req, res, next) => {
    try {

        if (!validation(req, res)) return;

        const { zones } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);

        // Check if zones is a non-empty array
        if (Array.isArray(zones) && zones.length > 0) {

            for (const item of zones) {
                const zone = new Zone({
                    name: item.name,
                    created_by: userId,
                    company_id: user.company_id,
                    master_company_id: user.master_company_id,
                    parent_company_id: user.parent_company_id
                });

                await zone.save(); // Await properly inside a loop
            }

            return res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: 'Zone(s) added successfully!',
            });

        } else {
            return res.status(400).json({
                status: "Failure",
                statusCode: 400,
                message: 'Zone creation failed! No zones provided.',
            });
        }
    } catch (error) {
        console.error('Error occurred', error);
        return res.status(500).json({
            status: "Failure",
            statusCode: 500,
            message: 'Internal server error'
        });
    }
};

exports.putZoneAPI = async (req, res, next) => {
    try {

        const userId = req.userId;
        const id = req.params.id;

        const zone = await Zone.findOne({ created_by: userId, _id: id });

        if (!zone) {
            res.status(404).json({
                status: "Failure",
                statusCode: 404,
                message: "Zone does not exist"
            })
        }

        const { name } = req.body;

        zone.name = name;

        await zone.save();

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Zone updated successfully!",
            name
        });

    } catch (error) {
        next(error)
    }
}