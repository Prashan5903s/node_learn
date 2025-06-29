const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
    name: {
        type: String, 
        maxlength: 65535, // Maximum length for TEXT
        required: true, // name is required
    },
    path: {
        type: String,
        maxlength: 65535, // Maximum length for TEXT
        required: true, // path is required
    },
    type: {
        type: String,
        maxlength: 65535, // Maximum length for TEXT
        required: true, // type is required
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

module.exports = mongoose.model('attachments', attachmentSchema); // Model name 'Attachment'
