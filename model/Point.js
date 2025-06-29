const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pointSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT
        required: true, // user_id is required
        ref: 'users', // Reference to 'users' collection
    },
    module_type: {
        type: mongoose.Schema.Types.ObjectId, // VARCHAR(255)
        maxlength: 255, // Limit the length to 255 characters
        required: true, // module_type is required
        ref: "module_type"
    },
    points: {
        type: Number, // INTEGER
        required: true, // points is required
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

module.exports = mongoose.model('points', pointSchema); // Model name 'Point'
