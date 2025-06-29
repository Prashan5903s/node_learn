const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workflowSchema = new Schema({
    name: {
        type: String,
        maxlength: 255, // Limit length to 255 characters
        required: true, // name is required
    },
    trigger_event: {
        type: String,
        maxlength: 255, // Limit length to 255 characters
        required: true, // trigger_event is required
    },
    is_active: {
        type: Boolean,
        required: true, // is_active is required
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // created_by is required
        ref: 'users', // Assuming there's a 'users' collection to reference
    },
    created_at: {
        type: Date,
        required: true, // created_at is required
        default: Date.now, // Default to current date/time
    },
    updated_at: {
        type: Date,
        required: false, // updated_at is optional
    },
});

module.exports = mongoose.model('workflows', workflowSchema); // Model name 'Workflow'
