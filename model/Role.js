const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    company_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        maxlength: 5000
    },
    type: {
        type: Boolean,
        required: true
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    permissions: {
        type: Map,
        of: [
            {
                type: Schema.Types.ObjectId,
                ref: "permissions" // or your permission model
            }
        ],
        required: false
    }
});

module.exports = mongoose.model('roles', roleSchema);
