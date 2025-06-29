const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attemptSchema = new Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // company_id is required
        ref: 'users', // Assuming there's a 'companies' collection to reference
    },
    schedule_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // schedule_id is required
        ref: 'schedules', // Assuming there's a 'schedules' collection to reference
    },
    status: {
        type: String,
        enum: ['pending', 'completed'], // Enforce enum values
        required: true, // status is required
    },
    obtained: {
        type: Number,
        required: false, // obtained is optional
    },
    score: {
        type: Number,
        required: false, // score is optional
    },
    percentage: {
        type: mongoose.Schema.Types.Decimal128,
        required: false, // percentage is optional
    },
    date: {
        type: Date, 
        required: true, // date is required
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
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // user_id is required
        ref: 'users', // Assuming there's a 'users' collection to reference
    },
});

module.exports = mongoose.model('attempts', attemptSchema); // Model name 'Attempt'
