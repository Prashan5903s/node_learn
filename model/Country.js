const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const countrySchema = new Schema({
    country_id: {
        type: Number,  // Use String if you want alphanumeric codes (like "US")
        required: true,
        maxlength: 255,
        minlength: 1,  // Optional: enforce minimum length
    },
    language_id: {
        type: Number,  // Use String if you want alphanumeric codes (like "US")
        required: true,
        maxlength: 255,
        minlength: 1,  // Optional: enforce minimum length
    },
    country_name: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 2,  // Optional: enforce minimum length
    },
    sortname: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 2,  // Optional: enforce minimum length
    },
    is_active: {
        type: Number,
        default: 0
    },
    states: [{
        country_id: {
            type: Number,
            required: true,
            maxlength: 255,
            minlength: 1,
        },
        state_id: {
            type: Number,
            required: true,
            maxlength: 255,
            minlength: 1,
        },
        language_id: {
            type: Number,
            required: true,
            maxlength: 255,
            minlength: 1,
        },
        state_name: {
            type: String,
            required: true,
            maxlength: 255,
            minlength: 2,
        },
        is_active: {
            type: Number,
            default: 0
        },
        cities: [{
            city_id: {
                type: Number,
                required: true,
                maxlength: 255,
                minlength: 1,
            },
            state_id: {
                type: Number,
                required: true,
                maxlength: 255,
                minlength: 1,
            },
            language_id: {
                type: Number,
                required: true,
                maxlength: 255,
                minlength: 1,
            },
            city_name: {
                type: String,
                required: true,
                maxlength: 255,
                minlength: 2,
            },
            is_active: {
                type: Number,
                default: 0
            },
        }]
    }]
});



module.exports = mongoose.model("countries", countrySchema);