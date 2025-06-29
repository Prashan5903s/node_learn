const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paticipationTypeSchema = new Schema({
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
    status: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model('participation_types', paticipationTypeSchema);
