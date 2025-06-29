const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moduleTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive']
    }
});

module.exports('module_type', moduleTypeSchema)