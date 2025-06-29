const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workflowActionsSchema = new Schema({
    workflow_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // workflow_id is required
        ref: 'workflows' // Reference to 'workflows' collection
    },
    action_type: {
        type: String,
        maxlength: 255, // Limit length to 255 characters
        required: true, // action_type is required
    },
    action_data: {
        type: String,
        maxlength: 65535, // Maximum length for LONGTEXT
        required: true, // action_data is required
    }
});

module.exports = mongoose.model('workflow_actions', workflowActionsSchema); // Model name 'WorkflowAction'
