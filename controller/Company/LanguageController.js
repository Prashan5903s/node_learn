const User = require('../../model/User');
const language = require('../../model/Language');
const { successResponse, errorResponse, warningResponse } = require('../../util/response');
const Language = require('../../model/Language');

exports.getLanguageAPI = async (req, res, next) => {
    try {
        const userId = req.userId;
        const Language = await language.find({ created_by: userId });
        if (!language) {
            return errorResponse(res, "Language does not exist", {}, 404);
        }
        return successResponse(res, "Language fetched successfully", Language);
    } catch (error) {
        next(error);
    }
}

exports.postLanguageAPI = async (req, res, next) => {
    try {

        const userId = req.userId;

        const { name, short_name } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return errorResponse(res, "User does not exist", {}, 404)
        }

        const Language = new language({
            language_name: name,
            short_name,
            created_by: userId,
            company_id: user.company_id,
            master_company_id: user.master_company_id,
            parent_company_id: user.parent_company_id
        });

        await Language.save();

        return successResponse(res, "Language saved successfully");

    } catch (error) {
        next(error);
    }
}

exports.putLanguageAPI = async (req, res, next) => {
    try {

        const userId = req.userId;
        const id = req.params.id;

        const { name, short_name } = req.body;

        const language = await Language.findOneAndUpdate({ created_by: userId, _id: id }, { $set: { language_name: name, short_name } }, { new: true, runValidators: true });

        if (!language) {
            return errorResponse(res, "Language updation failed");
        }

        return successResponse(res, "Language updated successfully");

    } catch (error) {
        next(error);
    }
}

exports.getMenuAPI = async (req, res, next) => {
    try {
        const language = await Language.find().select('language_name short_name');

        if (!language) {
            return errorResponse(res, "Language does not exist", {}, 404)
        }

        return successResponse(res, "Language fetched successfully", language, 200);

    } catch (error) {
        next(error);
    }
}