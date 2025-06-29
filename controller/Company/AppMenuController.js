const appMenu = require('../../model/AppMenu');
const Language = require('../../model/Language');
const User = require('../../model/User');
const { errorResponse, successResponse } = require('../../util/response');

exports.getAppMenuAPI = async (req, res, next) => {
    try {

        const userId = req.userId;

        const AppMenu = await appMenu.find();

        const language = await Language.find({ created_by: userId });

        if (!appMenu || !language) {
            return errorResponse(res, "Data does not exist", {}, 404);
        }
        const data = { menu: AppMenu, language }

        return successResponse(res, "Menu data fetched successfully", data);

    } catch (error) {
        next(error);
    }
}

exports.postAppMenuAPI = async (req, res, next) => {
    try {
        const data = req.body;

        if (!data || data.length === 0) {
            return errorResponse(res, "Data does not exist", {}, 404);
        }

        for (const item of data) {
            const labelId = item['label_id'];
            const default_translation = item['language_values'];

            await appMenu.findByIdAndUpdate(labelId, { default_translation }, { new: true, runValidators: true });
        }

        return successResponse(res, "Data updated successfully");
    } catch (error) {
        next(error);
    }
};

exports.createLabelAPI = async (req, res, next) => {
    try {

        const userId = req.userId;

        const language = await Language.find({ created_by: userId });

        if (!language) {
            return errorResponse(res, "Language does not exist", {}, 404)
        }

        return successResponse(res, "Language fetched successfully", language)

    } catch (error) {
        next(error);
    }

}

exports.postLabelAPI = (req, res, next) => {
    try {

        const { name } = req.body;

        const AppMenu = new appMenu({
            label_name: name,
        })

        AppMenu.save();

        return successResponse(res, "App menu saved successfully")

    } catch (error) {
        next(error);
    }
}

exports.getMenuListingAPI = async (req, res, next) => {
    try {
        const userId = req.userId;

        const languages = await Language.find();
        const appMenus = await appMenu.find();

        if (!languages || !appMenus) {
            return errorResponse(res, 'Data does not exist', {}, 404);
        }

        const data = {};

        languages.forEach(language => {
            const languageId = language._id.toString();
            const shortName = language.short_name;
            const itemValue = {};

            appMenus.forEach(menu => {
                const labelName = menu.slug;
                let default_trans = [];

                if (Array.isArray(menu.number)) {
                    default_trans = menu.number.filter(val => {
                        return (
                            val.language_id?.toString().trim().toLowerCase() === languageId.toString().trim().toLowerCase() &&
                            val.created_by?.toString().trim().toLowerCase() === userId.toString().trim().toLowerCase()
                        );
                    });
                }
                if (default_trans.length === 0) {
                    default_trans = menu.default_translation.filter(val => {
                        return (
                            val.language_id?.toString().trim().toLowerCase() === languageId.toString().trim().toLowerCase()
                        );
                    });;
                }

                default_trans.forEach(value => {
                    const type = value.type;
                    const suffix = type === 1 ? "_singular" : "_plural";
                    const finalLabelName = labelName + suffix;
                    const finalValue = value.translation;
                    itemValue[finalLabelName] = finalValue;
                });
            });

            data[shortName] = itemValue;
        });

        return successResponse(res, "Menu list fetched successfully", data);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.getAppMenuCompanyListAPI = async (req, res, next) => {
    try {

        const userId = req.userId;

        const data = [];
        const AppMenu = await appMenu.find();
        const shortName = req.params.sn;

        if (!shortName) {
            return errorResponse(res, "Short name does not exist")
        }

        if (!AppMenu) {
            return errorResponse(res, "App menu does not exist")
        }

        const language = await Language.findOne({ short_name: shortName })

        if (!language) {
            return errorResponse(res, "Language does not exist")
        }

        const langId = language._id;
        AppMenu.map(item => {
            const name = item.label_name;
            const slug = item.slug;

            let default_trans = item.number;

            default_trans = default_trans.filter(val => {
                return (
                    val.language_id.toString().trim().toLowerCase() === langId.toString().trim().toLowerCase() &&
                    val.created_by.toString().trim().toLowerCase() === userId.toString().trim().toLowerCase()
                );
            });

            if (default_trans.length == 0) {
                default_trans = item.default_translation;
            }

            const filterData = default_trans.filter(value => {
                return value.language_id.toString() === langId.toString();
            });

            const singular = filterData.find(t => t.type === 1)?.translation || '';
            const plural = filterData.find(t => t.type === 2)?.translation || '';

            data.push({
                key: slug.trim().toLowerCase(),
                label: name,
                singularValue: singular,
                pluralValue: plural,
            });
        });

        // Return after map
        return successResponse(res, "Menu fetched successfully", data)

    } catch (error) {
        next(error);
    }
}

exports.postCompanyMenuListAPI = async (req, res, next) => {
    try {
        const userId = req.userId;
        const shortName = req.params.sn;

        if (!shortName) {
            return errorResponse(res, "Short name does not exist", {}, 404);
        }

        const language = await Language.findOne({ short_name: shortName });
        if (!language) {
            return errorResponse(res, "Language does not exist", {}, 404);
        }

        const langId = language._id;
        const data = req.body;
        const keys = Object.keys(data);

        const saveOperations = [];

        for (const key of keys) {
            const appMenuItem = await appMenu.findOne({ slug: key });

            if (!appMenuItem) continue;

            const values = data[key];
            const singular = values?.singular;
            const plural = values?.plural;

            if (!Array.isArray(appMenuItem.number)) {
                appMenuItem.number = [];
            }

            // Remove old translations for the same language_id and created_by
            appMenuItem.number = appMenuItem.number.filter(val => {
                return !(
                    val.language_id.toString().trim().toLowerCase() === langId.toString().trim().toLowerCase() &&
                    val.created_by.toString().trim().toLowerCase() === userId.toString().trim().toLowerCase()
                );
            });

            // Push new translations
            if (singular) {
                appMenuItem.number.push({
                    language_id: langId,
                    translation: singular,
                    type: 1,
                    created_by: userId
                });
            }

            if (plural) {
                appMenuItem.number.push({
                    language_id: langId,
                    translation: plural,
                    type: 2,
                    created_by: userId
                });
            }

            saveOperations.push(appMenuItem.save());
        }

        await Promise.all(saveOperations);

        return successResponse(res, "Menus saved successfully");

    } catch (error) {
        next(error);
    }
};

