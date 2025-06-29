require('dotenv').config();
const Role = require('../../model/Role');
const User = require('../../model/User');
const RoleUser = require('../../model/RoleUser');
const validate = require('../../util/validation');
const PermissionModule = require('../../model/PermissionModule');

exports.getRoleAPI = (req, res, next) => {
    Role.find({ created_by: req.userId })
        .select('type name description status permissions') // select specific fields from Role
        .populate('created_by', 'first_name last_name email')   // populate only name and email from User
        .populate('company_id', 'first_name last_name email')
        .then(data => {
            res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "Role fetched successfully!",
                data: data
            });
        })
        .catch(err => {
            next(err);
        });
};

exports.createDataAPI = async (req, res, next) => {
    const userId = req.userId;

    try {
        const data = await PermissionModule.find({ created_by: userId }).select('_id name permission')

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Data fetched successfully!",
            data
        });
    } catch (error) {
        next(error);
    }
};

exports.postRoleAPI = (req, res, next) => {
    if (!validate(req, res)) return;

    const { name, description, status, permissions } = req.body;

    User.findById(req.userId).then(user => {
        if (!user) {
            const error = new Error("User does not authenticated!");
            error.statusCode = 500;
            throw error;
        }
        const role = new Role({
            company_id: user._id,
            name: name,
            status: status,
            description: description,
            type: true,
            permissions,
            created_by: user._id
        });
        return role.save();
    }).then(() => {
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Role created successfully!"
        });
    }).catch(err => {
        next(err);
    })
}

exports.postRoleUserAPI = (req, res, next) => {

    if (!validate(req, res)) return;

    const { roleId, userId } = req.body;
    User.findById(req.userId).then(user => {
        const roleUser = new RoleUser({
            role_id: roleId,
            user_id: userId,
            created_by: user._id
        });
        return roleUser.save();
    }).then(() => {
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Role user created successfully"
        });
    }).catch(err => {
        next(err);
    })
}

exports.putRole = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;
        const { name, description, status, permissions } = req.body;
        const userId = req.userId;

        const role = await Role.findOne({ created_by: userId, _id: roleId });

        if (!role) {
            const error = new Error("Role does not exist!");
            error.statusCode = 404;
            throw error;
        }

        role.permissions = {};

        // Update basic fields
        role.name = name;
        role.description = description;
        role.status = status;

        // Clear and set new permissions map
        role.permissions = permissions

        await role.save();

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: 'Role updated successfully.'
        });
    } catch (err) {
        next(err);
    }
};

