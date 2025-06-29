const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // question_id is required
        ref: 'questions', // Reference to 'questions' collection
    },
    option: {
        type: String, 
        maxlength: 65535, // Maximum length for TEXT
        required: true, // option is required
    },
    is_correct: {
        type: Boolean, 
        required: true, // is_correct is required (true/false)
    },
    score: {
        type: Number,
        required: true, // score is required
    },
    created_at: {
        type: Date, 
        required: true, 
        default: Date.now, // Default to current date/time
    },
    updated_at: {
        type: Date, 
        required: false, // updated_at is optional
    },
});

module.exports = mongoose.model('answers', answerSchema); // Model name 'Answer'
