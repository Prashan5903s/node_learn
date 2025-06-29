const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define subchannel as a subdocument schema
const subChannelSchema = new Schema({
    name: {
        type: String,
        maxlength: 65535,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    }
}, { _id: true }); // enable _id for each subchannel if needed

// Define the channel schema with embedded subchannels
const channelSchema = new Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: false,
        ref: "users"
    },
    name: {
        type: String,
        maxlength: 65535,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    sub_channels: [subChannelSchema] // embedded array of subchannels
}, {
    timestamps: true
});

module.exports = mongoose.model('channels', channelSchema);
