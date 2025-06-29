const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionItemSchema = new Schema({
    name: {
        type: String,
        maxlength: 255,
        required: true,
    },
    slug: {
        type: String,
        maxlength: 255,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updated_at: {
        type: Date,
    }
});

const permissionModuleSchema = new Schema({
    name: {
        type: String,
        maxlength: 255,
        required: true,
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users', // Consider changing this to 'companies' if that's the intent
    },
    status: {
        type: Boolean,
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updated_at: {
        type: Date,
    },
    permission: [permissionItemSchema], // DIRECTLY use an array here
});

permissionModuleSchema.methods.addPermission = function (newItem) {
    this.permission.push(newItem);
    return this.save();
};

permissionModuleSchema.methods.removePermission = function (permissionId) {
    this.permission = this.permission.filter(item =>
        item._id.toString() !== permissionId.toString()
    );
    this.markModified('permission');
    return this.save();
};

permissionModuleSchema.methods.updatePermission = function ([permissionId, newItem]) {
    const item = this.permission.find(item =>
        item._id.toString() === permissionId.toString()
    );
    if (item) {
        Object.assign(item, newItem);
        this.markModified('permission');
        return this.save();
    } else {
        return Promise.reject(new Error('Permission item not found'));
    }
};

module.exports = mongoose.model('permission_modules', permissionModuleSchema);
