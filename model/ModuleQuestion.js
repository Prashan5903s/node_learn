const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moduleQuestionSchema = new Schema({
    module_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // company_id is required
        ref: 'modules', // Reference to 'companies' collection
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // updated_at is optional
        ref: "questions"
    },
});

module.exports = mongoose.model('module_questions', moduleQuestionSchema); // Model name 'Question'
