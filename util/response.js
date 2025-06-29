// utils/responseUtil.js

const successResponse = (res, message = "Success", data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        status: "Success",
        statusCode,
        message,
        data
    });
};

const errorResponse = (res, message = "An error occurred", error = {}, statusCode = 500) => {
    return res.status(statusCode).json({
        status: "Error",
        statusCode,
        message,
        error
    });
};

const warningResponse = (res, message = "Warning", data = {}, statusCode = 400) => {
    return res.status(statusCode).json({
        status: "Warning",
        statusCode,
        message,
        data
    });
};

module.exports = {
    successResponse,
    errorResponse,
    warningResponse
};
