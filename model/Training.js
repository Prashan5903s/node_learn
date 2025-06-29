const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trainingSchema = new Schema({
    category_id: {
        type: Number, // Matches INTEGER
        required: false, // Can be null
        ref: "categories"
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId, // Matches BIGINT
        required: false,
        ref: "users"
    },
    short_description: {
        type: String, // TEXT
        maxlength: 65535, // You can adjust the limit or leave it out as needed
        required: false,
    },
    start_date: {
        type: Date, // Matches DATE
        required: false,
    },
    description: {
        type: String, // LONGTEXT
        maxlength: 65535, // Adjust if necessary
        required: false,
    },
    title: {
        type: String, // TEXT
        maxlength: 65535,
        required: false,
    },
    image: {
        type: String, // TEXT
        maxlength: 65535,
        required: false,
    },
    created_at: {
        type: Date, // Matches DATETIME
        required: false,
        default: Date.now()
    },
    updated_at: {
        type: Date, // Matches TIMESTAMP
        required: false,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT
        required: false,
        ref: "users"
    },
    deleted_at: {
        type: Date, // DATETIME
        required: false,
    },
    end_date: {
        type: Date, // DATE
        required: false,
    },
    status: {
        type: String, // ENUM
        enum: ['active', 'inactive'], // Only these two values are allowed
        required: false,
    },
});

module.exports = mongoose.model('trainings', trainingSchema);
