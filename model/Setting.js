const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingSchema = new Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT
        required: true, // company_id is required
        ref: 'users', // Assuming there's a 'companies' collection to reference
    },
    key: {
        type: String, // VARCHAR(255)
        maxlength: 255, // Limit the length of the key
        required: true, // key is required
    },
    value: {
        type: String, // TEXT(65535)
        maxlength: 65535, // Maximum length for TEXT
        required: true, // value is required
    },
});

module.exports = mongoose.model('settings', settingSchema); // Model name 'Setting'
