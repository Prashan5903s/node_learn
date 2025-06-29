const User = require('../../model/User');
const validation = require('../../util/validation');
const PackageType = require('../../model/PackageType');

exports.getPackageTypeAPI = async (req, res, next) => {

    const userId = req.userId;

    const packageTypes = await PackageType.find({ created_by: userId });

    const nameData = await PackageType.find().select('_id name');

    if (!packageTypes) {
        const error = new Error('Package Type not exist');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: 'Success',
        statusCode: 200,
        message: "Package Type fetched successfully!",
        data: {
            packageTypes,
            nameData
        }
    });
}

exports.postPackageType = (req, res, next) => {
    if (!validation(req, res)) return;
    const { name, status } = req.body;

    User.findById(req.userId).then(user => {
        if (!user) {
            const error = new Error('User does not exist');
            error.statusCode = 401;
            throw error;
        }
        const package = new PackageType({
            created_by: user._id,
            status: status,
            name: name,
        });
        return package.save();
    }).then(() => {
        res.status(200).json({
            status: 'Success',
            statusCode: 200,
            message: "Package Type created successfully!"
        });
    }).catch(err => {
        next(err);
    })
}

exports.updatePackageTypeAPI = async (req, res, next) => {
    if (!validation(req, res)) return;

    const id = req.params.packageTypeId;
    const { name, status } = req.body;

    try {
        const packageType = await PackageType.findById(id);

        if (!packageType) {
            const error = new Error("Package type does not exist");
            error.statusCode = 404;
            throw error;
        }

        // Update fields
        packageType.name = name;
        packageType.status = status;

        // Save updated document
        const updatedPackageType = await packageType.save();

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Package type updated successfully!",
            data: updatedPackageType
        });
    } catch (err) {
        next(err);
    }
};
