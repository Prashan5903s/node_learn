const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packagePointSchema = new Schema({
    package_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // package_id is required
        ref: 'packages', // Reference to 'packages' collection
    },
    point_cr: {
        type: Number, 
        required: true, // point_cr is required
    },
    point_dr: {
        type: Number, // FLOAT 
        required: true, // point_dr is required
    },
    remaining: {
        type: Number, // FLOAT 
        required: true, // remaining is required
    },
    slug: {
        type: String, // VARCHAR(255) 
        maxlength: 255, // Limit the length to 255 characters
        required: true, // slug is required
    },
    description: {
        type: String, // TEXT(65535) 
        maxlength: 65535, // Maximum length for TEXT
        required: true, // description is required
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT 
        required: true, // created_by is required
        ref: 'users', // Reference to 'users' collection
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT 
        required: true, // company_id is required
        ref: 'users', // Reference to 'companies' collection
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

module.exports = mongoose.model('package_point', packagePointSchema); // Model name 'PackagePoint'
