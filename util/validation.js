const { validationResult } = require('express-validator');

module.exports = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            status: 'Failure',
            statusCode: 422,
            message: "Validation failed",
            error: errors.array()
        });
        return false;
    }
    return true;
};
