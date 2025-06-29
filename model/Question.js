const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT
        required: true, // company_id is required
        ref: 'users', // Reference to 'companies' collection
    },
    title: {
        type: String, // TEXT(65535)
        maxlength: 65535, // Maximum length for TEXT
        required: true, // title is required
    },
    description: {
        type: String, // TEXT(65535)
        maxlength: 65535, // Maximum length for TEXT
        required: true, // description is required
    },
    score: {
        type: Number, // FLOAT
        required: true, // score is required
    },
    created_at: {
        type: Date, // DATETIME
        required: true, // created_at is required
        default: Date.now, // Default to current date/time
    },
    updated_at: {
        type: Date, // TIMESTAMP
        required: false, // updated_at is optional
    },
});

module.exports = mongoose.model('questions', questionSchema); // Model name 'Question'
