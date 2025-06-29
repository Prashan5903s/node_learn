const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const permissionRoleSchema = new Schema({
    permission_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT 
        required: true, // permission_id is required
        ref: 'permissions', // Reference to 'permissions' collection
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT 
        required: true, // role_id is required
        ref: 'roles', // Reference to 'roles' collection
    },
    created_at: {
        type: Date, // DATETIME 
        required: true, // created_at is required
        default: Date.now, // Default to current date/time
    },
    updated_at: {
        type: Date, // TIMESTAMP 
        required: false, // updated_at is optional
    }
});

module.exports = mongoose.model('permission_role', permissionRoleSchema); // Model name 'PermissionRole'
