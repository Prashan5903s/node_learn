const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    name: {
        type: String, // VARCHAR(255)
        maxlength: 255, // Maximum length of 255 characters
        required: true, // Name is required
    },
    module_training_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT
        required: true, // module_training_id is required
        ref: 'module_training', // Reference to 'module_trainings' collection
    },
    start_date: {
        type: Date, // DATE
        required: true, // start_date is required
    },
    end_date: {
        type: Date, // DATE
        required: true, // end_date is required
    },
    address: {
        type: String, // VARCHAR(255)
        maxlength: 255, // Maximum length of 255 characters
        required: true, // address is required
    },
    city: {
        type: String, // TEXT(65535)
        maxlength: 65535, // Maximum length for TEXT
        required: true, // city is required
    },
    created_at: {
        type: Date, // DATETIME
        required: false, // created_at is optional
        default: Date.now, // Default to current date/time
    },
    updated_at: {
        type: Date, // TIMESTAMP
        required: false, // updated_at is optional
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT
        required: true, // company_id is required
        ref: 'users', // Reference to 'companies' collection
    },
});

module.exports = mongoose.model('schedules', scheduleSchema); // Model name 'Schedule'
