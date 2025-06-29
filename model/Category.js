const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: false,
        ref: "users"
    },
    name: {
        type: String,
        maxlength: 65535, // You can adjust this if you want to limit the size of the text
        required: true, // Assuming the name is required
    },
    type: {
        type: String, 
        enum: ['module', 'training'], // Only these two values are allowed
        required: true, // Assuming type is required
    },
});

module.exports = mongoose.model('categories', categorySchema);
