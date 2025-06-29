const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const certificateSchema = new Schema({
    name: {
        type: String, 
        maxlength: 255, // Limit the length to 255 characters
        required: true, // name is required
    },
    template: {
        type: String, 
        maxlength: 65535, // Maximum length for LONGTEXT
        required: true, // template is required
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // company_id is required
        ref: 'users', // Reference to 'companies' collection
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // created_by is required
        ref: 'users', // Reference to 'users' collection (assuming there's a users collection)
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

module.exports = mongoose.model('certificates', certificateSchema); // Model name 'Certificate'
