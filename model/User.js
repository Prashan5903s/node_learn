const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const {
    encrypt,
    decrypt,
    hash,
    normalizeEmail,
    normalizePhone
  } = require('../util/encryption');

const UserCodeSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
      unique: false // unique across users? handled manually
    },
    issued_on: Date, // Optional: date when it was issued
    type: String      // Optional: internal, external, etc.
  }, { _id: true }); // Avoids creating _id for sub-docs

const userSchema = new Schema({
    company_id: {
        type: Schema.Types.Mixed,
        required: true,
        ref: "users",
        validate: {
            validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
            message: props => `${props.value} is not a valid ObjectId or number`,
        },
    },
    first_name: {
        type: String,
        required: true,
        maxlength: 255,
    },
    last_name: {
        type: String,
        maxlength: 255,
        required: true,
    },
    company_name: {
        type: String,
        maxlength: 255,
        required: false
    },
    email: {
        type: String,
        set: function (val) {
            const norm = normalizeEmail(val);
            this.email_hash = hash(norm); // for searching
            return encrypt(norm);
        },
        get: decrypt
    },
    email_hash: {
        type: String
    },
    alternative_email: {
        type: String,
        maxlength: 255,
        required: false,
    },
    password: {
        type: String,
        maxlength: 255,
        required: true,
        // select: false
    },
    phone: {
        type: String,
        set: function (val) {
            const norm = normalizePhone(val);
            this.phone_hash = hash(norm);
            return encrypt(norm);
        },
        get: function (val) {
            return decrypt(val);
        },
    },
    phone_hash: {
        type: String
    },
    status: {
        type: Boolean,
        default: 0,
    },
    address: {
        type: String,
        maxlength: 4000,
    },
    pincode: {
        type: String,
        required: false,
        minLength: 6,
        maxlength: 10
    },
    package_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "package"
    },
    country_id: {
        type: String,
        ref: "countries",
        required: false,
    },
    state_id: {
        type: String,
        required: false,
    },
    city_id: {
        type: String,
        required: false,
    },
    gst_no: {
        type: String,
        required: false,
    },
    pan_no: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    },
    photo: {
        type: String,
        // maxlength: 255
    },
    is_verified: {
        type: Boolean
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    master_company_id: {
        type: Schema.Types.Mixed,
        ref: "users",
        required: true,
        validate: {
            validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
            message: props => `${props.value} is not a valid ObjectId or number`,
        },
    },
    parent_company_id: {
        type: Schema.Types.Mixed,
        ref: "users",
        required: true,
        validate: {
            validator: v => Types.ObjectId.isValid(v) || typeof v === 'number',
            message: props => `${props.value} is not a valid ObjectId or number`,
        },
    },
    designation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "destinations",
        set: v => (v === '' ? undefined : v)
    },
    zone_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "zones",
        set: v => (v === '' ? undefined : v)
    },
    dob: {
        type: Date,
        required: false,
    },
    urn_no: {
        type: String,
        required: false,
    },
    idfa_code: {
        type: String,
        required: false,
    },
    application_no: {
        type: String,
        required: false,
    },
    licence_no: {
        type: String,
        required: false,
    },
    employee_type: {
        type: String,
        required: false,
    },
    participation_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "participation_types",
        set: v => (v === '' ? undefined : v)
    },
    codes: [UserCodeSchema], // Array of codes
});

// UserSchema.index({ 'employee_codes.code': 1 });

userSchema.virtual('emp_id').get(function () {
    const activeCodeObj = (this.codes || []).find(code => code.type === 'active');
    return activeCodeObj?.code || null;
});

userSchema.virtual('roles', {
    ref: 'role_user',
    localField: '_id',
    foreignField: 'user_id',
    justOne: false
  });

userSchema.set('toJSON', { virtuals: true, getters: true });
userSchema.set('toObject', { virtuals: true, getters: true });

// userSchema.pre('save', function (next) {
//     if (this.isModified('first_name')) {
//       this.first_name = encrypt(this.first_name.toLowerCase());
//     }
//     next();
//   });

module.exports = mongoose.model("users", userSchema);
