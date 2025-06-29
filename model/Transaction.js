const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.BigInt, 
        required: true, // user_id is required
        ref: 'users', // Reference to the 'users' collection
    },
    company_id: {
        type: mongoose.Schema.Types.BigInt, // BIGINT 
        required: true, // company_id is required
        ref: 'users', // Assuming there's a 'companies' collection to reference
    },
    package_id: {
        type: Number, // INTEGER 
        required: true, // package_id is required
        ref: 'packages', // Reference to the 'packages' collection
    },
    transaction_id: {
        type: String, // VARCHAR(255) 
        maxlength: 255, // Limit the length of the transaction_id
        required: true, // transaction_id is required
    },
    payment_method: {
        type: String, // VARCHAR(255) 
        maxlength: 255, // Limit the length of the payment_method
        required: true, // payment_method is required
    },
    payment_status: {
        type: String, // VARCHAR(255) 
        maxlength: 255, // Limit the length of the payment_status
        required: true, // payment_status is required
    },
    transaction_date: {
        type: Date, // DATE 
        required: true, // transaction_date is required
        default: Date.now()
    },
    note: {
        type: String, // TEXT(65535) 
        maxlength: 65535, // Maximum length for TEXT
        required: false, // note is optional
    },
    order_id: {
        type: String, // VARCHAR(255) 
        maxlength: 255, // Limit the length of the order_id
        required: false, // order_id is optional
    },
    created_at: {
        type: Date, // DATETIME 
        required: false, // created_at is optional
        default: Date.now(), // Set the default to the current date/time
    },
});

module.exports = mongoose.model('transactions', transactionSchema); // Model name 'Transaction'
