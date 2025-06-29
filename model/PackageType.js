const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packageTypeSchema = new Schema({
    name: {
        type: String, // VARCHAR 
        minlength: 4,
        maxlength: 25, // Limit for VARCHAR(255)
        required: true, // Name is required
    },
    status: {
        type: Boolean,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    package: {
        items: [
            {
                name: {
                    type: String,
                    maxlength: 255, // Limit for VARCHAR(255)
                    required: true, // Name is required
                },
                description: {
                    type: String,
                    maxlength: 65535, // Maximum length for LONGTEXT (though MongoDB will store it as a large string)
                    required: false, // Assuming description is optional
                },
                package_type_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false, // Can be null
                    ref: "package_types",
                },
                status: {
                    type: Boolean,
                    required: true, // Status is required
                },
                amount: {
                    type: Number,
                    required: true, // Amount is not optional (can be null)
                },
                created_at: {
                    type: Date,
                    required: false, // Created date is optional
                    default: Date.now()
                },
                updated_at: {
                    type: Date,
                    required: false, // Updated date is optional
                },
                permissions: {
                    type: Map,
                    of: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "permissions" // or your permission model
                        }
                    ],
                    required: false
                }
            }
        ],
    }
});


packageTypeSchema.methods.addPackage = function (newItem) {
    this.package.items.push(newItem);
    return this.save();
};

packageTypeSchema.methods.updatePackage = function ([id, newItem]) {
    const item = this.package.items.find(item => item._id.toString() === id.toString());

    if (item) {
        // Replace the permissions object if provided
        if (newItem.permissions) {
            item.permissions = { ...newItem.permissions };
        }

        // Update other fields, excluding permissions
        const { permissions, ...otherFields } = newItem;
        Object.assign(item, otherFields);

        this.markModified('package'); // mark the whole package field as modified
        return this.save();
    } else {
        return Promise.reject(new Error('Item not found'));
    }
};

packageTypeSchema.methods.removePackage = function (packageId) {
    // Convert to string for safe comparison
    this.package.items = this.package.items.filter(item => item._id.toString() !== packageId.toString());
    this.markModified('package'); // Necessary for nested object changes
    return this.save();
};


module.exports = mongoose.model('package_types', packageTypeSchema); // Model name 'Package'
