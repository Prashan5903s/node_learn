const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activityLogSchema = new Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // company_id is required
        ref: 'users', // Reference to 'companies' collection
    },
    log_title: {
        type: String,
        maxlength: 65535, // Maximum length for TEXT
        required: true, // log_title is required
    },
    log: {
        type: String, 
        maxlength: 65535, // Maximum length for LONGTEXT
        required: true, // log is required
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

module.exports = mongoose.model('activity_logs', activityLogSchema); // Model name 'ActivityLog'
