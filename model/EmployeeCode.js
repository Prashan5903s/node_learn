const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeCodeSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // user_id is required
        ref: "users"
    },
    code: {
        type: String, 
        maxlength: 255, // Limit the length of the code
        required: true, // Code is required
    },
    is_active: {
        type: Boolean, 
        required: true, // is_active is required, true or false
    },
    created_at: {
        type: Date, 
        required: false, // created_at is optional
        default: Date.now()
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // company_id is required
        ref: "users"
    },
});

module.exports = mongoose.model('employee_codes', employeeCodeSchema); // Model name 'EmployeeCode'
