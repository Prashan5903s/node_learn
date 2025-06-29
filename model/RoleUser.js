const mongoose = require('mongoose')

const schema = mongoose.Schema;

const roleUserSchema = new schema({
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    assigned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
    },
    assigned_at: { 
        type: Date, 
        default: Date.now 
    }
});

roleUserSchema.index({ user_id: 1, role_id: 1 }, { unique: true });

module.exports = mongoose.model('role_user', roleUserSchema);