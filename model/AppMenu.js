const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const appMenuSchema = new Schema({
    label_name: {
        type: String,
        maxlength: 255,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        maxlength: 255,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    default_translation: [
        {
            language_id: {
                type: Schema.Types.ObjectId,
                maxlength: 255,
                ref: "language",
                required: true
            },
            type: {
                type: Number,
                enum: [1, 2]
            },
            translation: {
                type: String,
                required: true
            }
        }
    ],
    number: [
        {
            type: {
                type: Number,
                enum: [1, 2]
            },
            language_id: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "language",
            },
            translation: {
                type: String,
                required: true
            },
            created_by: {
                type: Schema.Types.ObjectId,
                ref: "users",
                required: true
            },
        }
    ]
});

// Slug middleware
appMenuSchema.pre('save', function (next) {
    if (this.isModified('label_name')) {
        this.slug = this.label_name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, ''); // remove invalid characters
    }
    next();
});

module.exports = mongoose.model('app_menu', appMenuSchema);
