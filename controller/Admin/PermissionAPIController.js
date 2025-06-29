const mongoose = require('mongoose');
const validation = require('../../util/validation')
const user = require('../../model/User')
const packageType = require('../../model/PackageType')
const PermissionModule = require('../../model/PermissionModule');
const { errorResponse, successResponse } = require("../../util/response")

exports.getPermission = async (req, res, next) => {
    const userId = req.userId?.toString();

    try {
        // Get all permission modules including permission and name
        const allPermissionModules = await PermissionModule.find(
            {
                $or: [
                    { created_by: userId },
                    { 'permission.0': { $exists: true } }
                ]
            },
            { permission: 1, name: 1, created_by: 1 }
        ).lean();

        if (!allPermissionModules || allPermissionModules.length === 0) {
            const error = new Error("Permission modules do not exist!");
            error.statusCode = 404;
            throw error;
        }

        const permissionMap = new Map();

        allPermissionModules.forEach((module) => {
            const moduleId = module._id.toString();
            const moduleName = module.name || '';
            const createdBy = module.created_by?.toString();

            module.permission?.forEach((perm, index) => {
                const permId = perm._id.toString();

                if (!permissionMap.has(permId)) {
                    permissionMap.set(permId, {
                        ...perm,
                        index,
                        permission_module_ids: [moduleId],
                        permission_module_names: [moduleName],
                        created_by_list: [createdBy],
                    });
                } else {
                    const existing = permissionMap.get(permId);
                    existing.permission_module_ids.push(moduleId);
                    existing.permission_module_names.push(moduleName);
                    existing.created_by_list.push(createdBy);
                }
            });
        });

        const allPermission = [];
        const totalPermission = [];

        for (const [_, value] of permissionMap.entries()) {
            const finalPerm = {
                ...value,
                permission_module_names: value.permission_module_names.join(', '),
            };

            // If any of the modules for this permission were created by the current user
            const isUserCreated = value.created_by_list.some(creatorId => creatorId === userId);

            if (isUserCreated) {
                allPermission.push(finalPerm);
            }

            totalPermission.push(finalPerm);
        }

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Data fetched successfully",
            data: {
                allPermission,
                totalPermission,
            },
        });

    } catch (error) {
        next(error);
    }
};

exports.createPermission = async (req, res, next) => {
    const userId = req.userId;

    const formData = await PermissionModule.find({ created_by: userId });

    if (!formData) {
        const error = new Error("Permission module data does not exist")
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data fetched successfully!",
        data: formData
    });

};

const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/-+/g, '-');        // Collapse multiple -

exports.editPermission = async (req, res, next) => {
    const permissionId = req.params.permissionId;

    try {
        // Find all permission modules where the permission exists
        const matchedModules = await PermissionModule.find({
            'permission._id': permissionId
        });

        if (!matchedModules.length) {
            const error = new Error("Permission not found in any module.");
            error.statusCode = 404;
            throw error;
        }

        // Get the matching permission from the first module
        const firstPermission = matchedModules[0].permission.find(
            (perm) => perm._id.toString() === permissionId
        );

        if (!firstPermission) {
            const error = new Error("Permission data inconsistent.");
            error.statusCode = 500;
            throw error;
        }

        // Collect all module IDs that have this permission
        const permissionModuleIds = matchedModules.map(mod => mod._id.toString());

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Permission data fetched successfully",
            data: {
                ...firstPermission.toObject(),
                permission_module_id: permissionModuleIds
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.postPermission = async (req, res, next) => {
    if (!validation(req, res)) return;

    const { name, status, permissionmodule } = req.body;
    const userId = req.userId;

    try {
        if (!Array.isArray(permissionmodule) || permissionmodule.length === 0) {
            const error = new Error("At least one permission module is required.");
            error.statusCode = 400;
            throw error;
        }

        const slug = slugify(name);
        const sharedPermissionId = new mongoose.Types.ObjectId();

        for (const moduleId of permissionmodule) {
            const moduleDoc = await PermissionModule.findOne({
                _id: moduleId,
                created_by: userId
            });

            if (!moduleDoc) {
                const error = new Error(`Permission module with ID ${moduleId} does not exist.`);
                error.statusCode = 404;
                throw error;
            }

            // Skip if permission with same _id already exists
            const alreadyExists = moduleDoc.permission.some(
                (perm) => perm._id.equals(sharedPermissionId)
            );

            if (alreadyExists) continue;

            const newPermissionItem = {
                _id: sharedPermissionId,
                name,
                status,
                slug,
                created_by: userId,
            };

            await moduleDoc.addPermission(newPermissionItem);
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Permissions added successfully",
        });

    } catch (error) {
        next(error);
    }
};

exports.putPermission = async (req, res, next) => {
    const userId = req.userId;
    const permissionId = req.params.permissionId;
    const { name, status, permissionmodule } = req.body;

    try {
        // Step 1: Remove the permission from all permission modules
        await PermissionModule.updateMany(
            {},
            { $pull: { permission: { _id: permissionId } } }
        );

        // Step 2: Prepare the permission object to insert
        const newPermission = {
            _id: permissionId, // re-using the same _id
            name,
            slug: slugify(name),
            status,
            created_by: userId
        };

        // Step 3: Add it to the selected permission modules
        const updateOps = permissionmodule.map(moduleId => (
            PermissionModule.updateOne(
                { _id: moduleId },
                { $push: { permission: newPermission } }
            )
        ));

        await Promise.all(updateOps);

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Permission updated across selected modules",
        });

    } catch (error) {
        next(error);
    }
};

const normalizeToArray = (data) => {
    if (!data) return [];
    if (typeof data === 'string') return [data];
    if (Array.isArray(data)) return data.flat(Infinity).map(String);
    if (typeof data === 'object') return Object.values(data).flat(Infinity).map(String);
    return [];
};

exports.getPermAllowAPI = async (req, res, next) => {
    try {
        const userId = req.userId;

        const listing = '681c58fb4cfdc0f1124c1748';
        const edit = '681c58ee4cfdc0f1124c172d';
        const add = '681c58e24cfdc0f1124c171b';
        const import_data = '682d959a3cbed2993fc2c0ef';

        const superAdminId = '6811ae35704460d978b84eaa';
        const designation = '6853af54bf2b29d85a47cbf5';
        const department = '6853af4bbf2b29d85a47cbd4'
        const channel = '6853af38bf2b29d85a47cb41';
        const label = '685394cabf2b29d85a47741e';
        const users = '681c58b04cfdc0f1124c1705';
        const branch = '685394b1bf2b29d85a4773a3';
        const region = '685394aabf2b29d85a47738e';
        const zone = '6853946dbf2b29d85a477379';

        let isSuperAdmin = false;
        let isCompany = false;

        const permissionsStatus = {
            hasZonePermission: false,
            hasZoneAddPermission: false,
            hasZoneEditPermission: false,
            hasRegionPermission: false,
            hasRegionAddPermission: false,
            hasRegionEditPermission: false,
            hasBranchPermission: false,
            hasBranchAddPermission: false,
            hasBranchEditPermission: false,
            hasUserPermission: false,
            hasUserAddPermission: false,
            hasUserEditPermission: false,
            hasLabelPermission: false,
            hasUserImportPermission: false,
            hasChannelPermission: false,
            hasChannelAddPermission: false,
            hasChannelEditPermission: false,
            hasDepartmentPermission: false,
            hasDepartmentAddPermission: false,
            hasDepartmentlEditPermission: false,
            hasDesignationPermission: false,
            hasDesignationAddPermission: false,
            hasDesignationEditPermission: false,
        };

        // If super admin, all permissions default to false (can be changed if needed)
        if (userId?.toString().trim() === superAdminId) {
            isSuperAdmin = true;
        } else {
            const User = await user.findById(userId);

            if (!User) {
                return errorResponse(res, "User does not exist", {}, 404);
            }

            const masterId = User.created_by?.toString().trim();

            if (masterId === superAdminId) {
                isCompany = true;

                const packageId = User.package_id;

                if (!mongoose.Types.ObjectId.isValid(packageId)) {
                    return errorResponse(res, "Invalid package ID", {}, 400);
                }

                const packageTypeDoc = await packageType.findOne({
                    'package.items._id': new mongoose.Types.ObjectId(packageId)
                }).lean();

                if (!packageTypeDoc) {
                    return errorResponse(res, 'Package type does not exist', {}, 404);
                }

                const matchedItem = packageTypeDoc.package.items.find(item =>
                    item._id.toString() === packageId.toString()
                );

                if (!matchedItem) {
                    return errorResponse(res, 'Package does not exist', {}, 404);
                }

                const permission = matchedItem.permissions || {};

                permissionsStatus.hasDesignationPermission = normalizeToArray(permission[designation]).includes(listing);
                permissionsStatus.hasDesignationAddPermission = normalizeToArray(permission[designation]).includes(add);
                permissionsStatus.hasDesignationEditPermission = normalizeToArray(permission[designation]).includes(edit)

                permissionsStatus.hasDepartmentPermission = normalizeToArray(permission[department]).includes(listing);
                permissionsStatus.hasDepartmentAddPermission = normalizeToArray(permission[department]).includes(add)
                permissionsStatus.hasDepartmentlEditPermission = normalizeToArray(permission[department]).includes(edit)

                permissionsStatus.hasChannelPermission = normalizeToArray(permission[channel]).includes(listing);
                permissionsStatus.hasChannelAddPermission = normalizeToArray(permission[channel]).includes(add);
                permissionsStatus.hasChannelEditPermission = normalizeToArray(permission[channel]).includes(edit);

                permissionsStatus.hasLabelPermission = normalizeToArray(permission[label]).includes(listing);

                permissionsStatus.hasUserPermission = normalizeToArray(permission[users]).includes(listing);
                permissionsStatus.hasUserAddPermission = normalizeToArray(permission[users]).includes(add)
                permissionsStatus.hasUserEditPermission = normalizeToArray(permission[users]).includes(edit)
                permissionsStatus.hasUserImportPermission = normalizeToArray(permission[users]).includes(import_data);

                permissionsStatus.hasBranchPermission = normalizeToArray(permission[branch]).includes(listing);
                permissionsStatus.hasBranchAddPermission = normalizeToArray(permission[branch]).includes(add)
                permissionsStatus.hasBranchAddPermission = normalizeToArray(permission[branch]).includes(edit)

                permissionsStatus.hasRegionPermission = normalizeToArray(permission[region]).includes(listing);
                permissionsStatus.hasRegionAddPermission = normalizeToArray(permission[region]).includes(add)
                permissionsStatus.hasRegionEditPermission = normalizeToArray(permission[region]).includes(edit)

                permissionsStatus.hasZonePermission = normalizeToArray(permission[zone]).includes(listing);
                permissionsStatus.hasZoneAddPermission = normalizeToArray(permission[zone]).includes(add);
                permissionsStatus.hasZoneEditPermission = normalizeToArray(permission[zone]).includes(edit);

            }
        }

        const data = {
            isSuperAdmin,
            isCompany,
            ...permissionsStatus
        };

        return successResponse(res, "Permission data fetched successfully", data);
    } catch (error) {
        console.error("Error in getPermAllowAPI:", error);
        return errorResponse(res, "Server error", {}, 500);
    }
};