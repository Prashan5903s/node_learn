const mongoose = require('mongoose');
const schema = mongoose.Schema;

const moduleSchema = new schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    title: {
        type: String,
        required: true,
        maxlength: 255,
    },
    description: {
        type: String,
        required: true,
        maxlength: 5000,
    },
    type: {
        type: Number,
        required: true,
        ref: "module_types"
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft', 'published'],
        required: true
    },
    duration: {
        type: Number, 
        required: false
    },
    certificate_id: {
        type: Number, 
        required: false,
        ref: "certificates"
    },
    created_by: {
        type: Number, 
        required: false
    },
    created_at: {
        type: Date, 
        default: Date.now
    },
    updated_at: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('modules', moduleSchema);
