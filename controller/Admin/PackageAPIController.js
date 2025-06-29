const validation = require('../../util/validation')
const PackageType = require('../../model/PackageType');
const PermissionModule = require('../../model/PermissionModule');

exports.getPackageAPI = async (req, res, next) => {

    const userId = req.userId;

    try {

        // Get all package types created by this user
        const packageTypes = await PackageType.find({ created_by: userId }, { package: 1, name: 1 });

        const totalPackageType = await PackageType.find({ 'package.items.0': { $exists: true } });

        if (!packageTypes || !totalPackageType) {
            const error = new Error("Package type does not exist!");
            error.statusCode = 404;
            throw error;
        }

        let allPackages = [];

        let totalPackage = [];

        totalPackageType.forEach((totPackType) => {
            const packgId = totPackType._id;
            const packageTypeName = totPackType.name;
            if (totPackType?.package?.items?.length) {
                totPackType.package.items.forEach((item, index) => {
                    totalPackage.push({
                        ...item.toObject(),
                        permissions: item.permissions, // convert Mongoose subdocument to plain object
                        package_type_id: packgId,
                        index: index,
                        packageTypeName: packageTypeName
                    });
                })
            }
        })

        packageTypes.forEach((pkgTypeDoc) => {
            const packageTypeId = pkgTypeDoc._id;
            const packageTypeName = pkgTypeDoc.name;

            if (pkgTypeDoc.package?.items?.length) {
                pkgTypeDoc.package.items.forEach((item, index) => {
                    allPackages.push({
                        ...item.toObject(), // convert Mongoose subdocument to plain object
                        permissions: item.permissions, // convert Mongoose subdocument to plain object
                        package_type_id: packageTypeId,
                        packageTypeName: packageTypeName,
                        index: index,
                    });
                });
            }
        });

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: "Data fetched successfully!",
            data: {
                allPackages,
                totalPackage
            },
        });

    } catch (error) {
        next(error);
    }
};

exports.createPackageAPI = async (req, res, next) => {
    const userId = req.userId;
    const packageType = await PackageType.find({ created_by: userId }).select('id name');
    const permission = await PermissionModule.find({ created_by: userId }).select('_id name permission')

    res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data fetched successfully!",
        data: {
            packageType,
            permission
        }
    });
}

exports.postPackageAPI = async (req, res, next) => {
    if (!validation(req, res)) return;
    const userId = req.userId;
    const { name, description, amount, packagetype, status, permissions } = req.body;
    try {
        const package_type = await PackageType.findOne({ _id: packagetype, created_by: userId });
        if (!package_type) {
            const error = new Error("Package type does not exist!");
            error.statusCode = 404;
            throw error;
        }

        const newItem = {
            name,
            description,
            amount,
            status,
            package_type_id: packagetype,
            permissions
        };

        await package_type.addPackage(newItem);

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: 'Package added successfully',
        });

    } catch (error) {
        next(error);
    }

}

exports.putPackageAPI = async (req, res, next) => {

    const userId = req.userId;
    const packageId = req.params.packageId;
    const packageTypeId = req.params.packageTypeId;

    const { name, description, amount, packagetype, status, _id, permissions } = req.body;

    const packageType = await PackageType.findOne({ created_by: userId, _id: packagetype });

    if (!packageType) {
        const error = new Error("Package Type does not exist!");
        error.statusCode = 404;
        throw error;
    }

    const newItem = {
        name,
        description,
        amount,
        status,
        package_type_id: packageType,
        permissions
    };

    if (packageTypeId.toString() !== packagetype.toString()) {

        const oldItem = {
            name,
            description,
            amount,
            status,
            package_type_id: packageTypeId,
            permissions
        };

        const oldPackageType = await PackageType.findOne({ created_by: userId, _id: packageTypeId });

        if (!oldPackageType) {
            const error = new Error("Package Type does not exist!");
            error.statusCode = 404;
            throw error;
        }

        const newPackageType = await PackageType.findOne({ created_by: userId, _id: packagetype });

        if (!newPackageType) {
            const error = new Error("Package Type does not exist!");
            error.statusCode = 404;
            throw error;
        }

        await oldPackageType.removePackage(packageId);

        await newPackageType.addPackage(oldItem);

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Data updated successfully",
        });

    }

    await packageType.updatePackage([packageId, newItem]);

    res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data updated successfully!"
    });

}