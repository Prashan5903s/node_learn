const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const languageSchema = new Schema({
    language_name: {
        type: String, // Fixed: "Type" → "type"
        maxLength: 255,
        required: true,
    },
    short_name: {
        type: String, // Fixed: "Type" → "type"
        maxLength: 255,
        required: true,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    master_company_id: {
        type: Schema.Types.Mixed,
        ref: "users",
        required: true,
        validate: {
            validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
            message: props => `${props.value} is not a valid ObjectId or number`
        }
    },
    parent_company_id: {
        type: Schema.Types.Mixed,
        ref: "users",
        required: true,
        validate: {
            validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
            message: props => `${props.value} is not a valid ObjectId or number`
        }
    }
});

module.exports = mongoose.model('language', languageSchema);
