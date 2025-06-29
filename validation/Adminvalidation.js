const { body, check } = require('express-validator');

exports.loginPostValidation = [
    check('email').isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    body('password').trim().isLength({ min: 6, max: 32 }).withMessage("Password should be min of 6 digit and max 32 digit")
];

exports.postRoleValidation = [
    body('status')
        .isBoolean().withMessage('Status should be true or false')
        .not().isEmpty().withMessage('Status is required'),
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 3, max: 20 }).withMessage('Role can be of min 3 and max 20 length'),
    body('description').notEmpty().withMessage('Description is required').isLength({ min: 4, max: 1000 }).withMessage('Description is min of 4 and max of 1000 length'),
];

exports.roleUserPostValidation = [
    body('user_id').notEmpty().withMessage("User id is required")
        .isMongoId().withMessage('User id should be of object type id'),
    body('role_id').notEmpty().withMessage("Role id is required")
        .isMongoId().withMessage('Role id should be of object type id'),
];

exports.permissionPostValidation = [

];

exports.packageTypePostValidation = [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 4, max: 25 }).withMessage("Package Type min length should be 4 and max 25"),
    body('status').notEmpty().withMessage("Status is required").isBoolean().withMessage("Status should be true or false")
];

exports.postPackageValidation = [
    body('name').notEmpty().withMessage("Name is required").isLength({ max: 255 }).withMessage("Name can be max of 255 length"),
    body('description').notEmpty().withMessage("Description is required").isLength({ max: 65535 }).withMessage("Description can be maximum 65535"),
    body('packagetype').notEmpty().withMessage('Package type is required').isMongoId().withMessage("Package Type should be object Id"),
    body('status').notEmpty().withMessage("Status is required").isBoolean().withMessage("Status should be of boolean type"),
    body('amount')
        .notEmpty().withMessage("Amount is required")
        .isNumeric().withMessage("Amount must be a number")
        .custom((value) => {
            if (Number(value) > 1_000_000_000_000) {
                throw new Error("Amount is too large");
            }
            return true;
        }),
]

exports.postPermissionModule = [
    body('name').notEmpty().withMessage("Name is required").isLength({ max: 255 }).withMessage("Permission module can be max of 255 length"),
    body('status').notEmpty().withMessage("Status is required").isBoolean().withMessage("It should be of true or false type")
]

exports.postPermission = [
    body('name').notEmpty().withMessage("Name is required").isLength({ max: 255 }).withMessage("Name max length should be 255"),
    body('status').notEmpty().withMessage("Status is required").isBoolean().withMessage("Status should be boolean"),
    body('permissionmodule').notEmpty().withMessage("Permission module is required")
];

exports.postCompany = [
    body('company_id')
        .notEmpty().withMessage("Company ID is required")
        .isMongoId().withMessage("Invalid Company ID"),

    body('first_name')
        .notEmpty().withMessage("First name is required")
        .isLength({ max: 255 }).withMessage("First name max length is 255"),

    body('last_name')
        .notEmpty().withMessage("Last name is required")
        .isLength({ max: 255 }).withMessage("Last name max length is 255"),

    body('company_name')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Company name max length is 255'),

    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be valid")
        .isLength({ max: 255 }).withMessage("Email max length is 255"),

    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ max: 255 }).withMessage("Password max length is 255"),

    body('phone')
        .notEmpty().withMessage("Phone number is required")
        .isLength({ max: 255 }).withMessage("Phone number max length is 255"),

    body('status')
        .optional()
        .isBoolean().withMessage("Status must be boolean"),

    body('dob')
        .notEmpty().withMessage("Date of birth is required")
        .isISO8601().withMessage("Date of birth must be a valid date"),

    body('address')
        .optional()
        .isLength({ max: 4000 }).withMessage("Address max length is 4000"),

    body('country_id')
        .optional()
        .isMongoId().withMessage("Invalid Country ID"),

    body('state_id')
        .optional()
        .isMongoId().withMessage("Invalid State ID"),

    body('city_id')
        .optional()
        .isMongoId().withMessage("Invalid City ID"),

    body('photo')
        .optional(),
    // .isLength({ max: 5000 }).withMessage("Photo path max length is 5000"),

    body('gst_no').optional().isLength({ min: 15, max: 15 }).withMessage("GST No should be of 15 digit"),

    body('pan_no').optional().isLength({ min: 10, max: 10 }).withMessage("PAN No should be of 10 digit"),

    body('website').optional().isLength({ min: 8, max: 10 }).withMessage("website min and max length should be 8 and 10"),

    body('is_verified')
        .optional()
        .isBoolean().withMessage("is_verified must be boolean"),

    body('created_by')
        .notEmpty().withMessage("created_by is required")
        .isInt().withMessage("created_by must be a number"),

    body('master_company_id')
        .notEmpty().withMessage("master_company_id is required")
        .isMongoId().withMessage("Invalid master_company_id"),

    body('parent_company_id')
        .notEmpty().withMessage("parent_company_id is required")
        .isMongoId().withMessage("Invalid parent_company_id")
];


exports.postDesignation = [
    body('name').notEmpty().withMessage("Name is required").isLength({ max: 255 }).withMessage("Name max length should be 255"),
    body('status').notEmpty().withMessage("Status is required").isBoolean().withMessage("Status should be boolean"),
];

exports.putUser = [
    body('roles')
      .isArray({ min: 1 }).withMessage("At least one role is required")
      .custom((arr) => arr.every(role => typeof role === 'string' || typeof role === 'object'))
      .withMessage("Each role must be a string or object"),
  ];