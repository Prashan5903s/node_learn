const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const zoneSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    status: {
        type: Boolean,
        default: true,
        required: false
    },
    company_id: {
        type: Schema.Types.Mixed,
        required: true,
        ref: "users",
        validate: {
            validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
            message: props => `${props.value} is not a valid ObjectId or number`,
        },
    },
    master_company_id: {
        type: Schema.Types.Mixed,
        required: false,
        ref: "users",
        validate: {
            validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
            message: props => `${props.value} is not a valid ObjectId or number`,
        },
    },
    parent_company_id: {
        type: Schema.Types.Mixed,
        required: false,
        ref: "users",
        validate: {
            validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
            message: props => `${props.value} is not a valid ObjectId or number`,
        },
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        required: false
    },
    region: [{
        name: {
            type: String,
            required: true,
            maxlength: 255
        },
        status: {
            type: Boolean,
            default: true,
            required: false
        },
        company_id: {
            type: Schema.Types.Mixed,
            required: true,
            ref: "users",
            validate: {
                validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
                message: props => `${props.value} is not a valid ObjectId or number`,
            },
        },
        master_company_id: {
            type: Schema.Types.Mixed,
            required: true,
            ref: "users",
            validate: {
                validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
                message: props => `${props.value} is not a valid ObjectId or number`,
            },
        },
        parent_company_id: {
            type: Schema.Types.Mixed,
            required: true,
            ref: "users",
            validate: {
                validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
                message: props => `${props.value} is not a valid ObjectId or number`,
            },
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        },
        created_at: {
            type: Date,
            default: Date.now(),
        },
        updated_at: {
            type: Date,
            required: false
        },
        branch: [{
            name: {
                type: String,
                required: true,
                maxlength: 255
            },
            code: {
                type: String,
                required: false,
                maxlength: 20,
            },
            status: {
                type: Boolean,
                default: false
            },
            company_id: {
                type: Schema.Types.Mixed,
                required: true,
                ref: "users",
                validate: {
                    validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
                    message: props => `${props.value} is not a valid ObjectId or number`,
                },
            },
            master_company_id: {
                type: Schema.Types.Mixed,
                required: true,
                ref: "users",
                validate: {
                    validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
                    message: props => `${props.value} is not a valid ObjectId or number`,
                },
            },
            parent_company_id: {
                type: Schema.Types.Mixed,
                required: true,
                ref: "users",
                validate: {
                    validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
                    message: props => `${props.value} is not a valid ObjectId or number`,
                },
            },
            created_by: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            updated_by: {
                type: mongoose.Schema.Types.ObjectId,
                required: false
            },
            created_at: {
                type: Date,
                default: Date.now(),
            },
            updated_at: {
                type: Date,
                required: false
            },
        }]
    }]
})

zoneSchema.methods.addRegion = async function (newItems) {
    this.region = newItems;       // Replace old with new
    await this.save();
};

module.exports = mongoose.model('Zones', zoneSchema);