const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const packageUserSchema = new Schema({
    package_id: {
        type: Number, // INTEGER 
        required: true, // The package_id is required
        ref: "packages"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // BIGINT 
        required: true, // user_id is required
        ref: "users"
    },
    amount: {
        type: Number, // DOUBLE  (stores decimal values)
        required: false, // Amount is optional
    },
    is_primary: {
        type: Boolean, // BOOLEAN 
        required: false, // is_primary is optional
    },
    purchase_date: {
        type: Date, // DATE 
        required: false, // purchase_date is optional
        default: Date.now()
    },
});

module.exports = mongoose.model('package_user', packageUserSchema); // Model name 'PackageUser'
