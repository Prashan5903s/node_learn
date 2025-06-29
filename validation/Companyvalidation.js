const { body, check } = require('express-validator')

exports.postZoneAPI = [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage("Name can be maximum of 255 length"),
]

exports.postRegionAPI = [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage("Name can be maximum of 255 length"),
    body('zone_id').notEmpty().withMessage("Zone is required")
]

exports.postLanguageAPI = [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage("Name can be maximum of 255 length"),
    body('short_name').notEmpty().withMessage('Short name is required').isLength({ max: 255 }).withMessage("Short Name can be maximum of 255 length"),
]