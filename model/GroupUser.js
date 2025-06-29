const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupUserSchema = new Schema({
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // company_id is required
        ref: 'groups', // Assuming there's a 'companies' collection to reference
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // company_id is required
        ref: 'users', // Assuming there's a 'companies' collection to reference
    }
});

module.exports = mongoose.model('group_user', groupUserSchema); // Model name 'Group'
