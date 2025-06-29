const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String, 
        maxlength: 255, // Limit the length of the name
        required: true, // name is required
    },
    description: {
        type: String, 
        maxlength: 65535, // Maximum length for TEXT
        required: false, // description is optional
    },
    status: {
        type: Boolean, 
        required: true, // status is required
    },
    created_at: {
        type: Date, 
        required: false, // created_at is optional
        default: Date.now(), // Set the default to the current date/time
    },
    updated_at: {
        type: Date, 
        required: false, // updated_at is optional
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // company_id is required
        ref: 'users', // Assuming there's a 'companies' collection to reference
    },
});

module.exports = mongoose.model('groups', groupSchema); // Model name 'Group'
