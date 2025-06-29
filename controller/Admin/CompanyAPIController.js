const User = require('../../model/User');
const Country = require('../../model/Country');
const PackageType = require('../../model/PackageType');
const bcrypt = require('bcryptjs')

exports.getCompanyIndexAPI = async (req, res, next) => {

    const userId = req.userId;
    const company = await User.find({ created_by: userId });

    res.status(200).json({
        'status': 'Success',
        'statusCode': 200,
        'message': 'Data successfully fetched!',
        data: {
            company,
        }
    });
}

exports.createCompanyAPI = async (req, res, next) => {

    const country = await Country.find();

    const userId = req.userId;

    const packageTypes = await PackageType.find({ created_by: userId }, { package: 1 });

    if (!packageTypes) {
        const error = new Error("Package type does not exist!");
        error.statusCode = 404;
        throw error;
    }

    let allPackages = [];

    packageTypes.forEach((pkgTypeDoc) => {
        const packageTypeId = pkgTypeDoc._id;

        if (pkgTypeDoc.package?.items?.length) {
            pkgTypeDoc.package.items.forEach((item, index) => {
                allPackages.push({
                    ...item.toObject(), // convert Mongoose subdocument to plain object
                    package_type_id: packageTypeId,
                    index: index,
                });
            });
        }
    });

    res.json({
        status: "Success",
        statusCode: 200,
        message: "Data fetched successfully",
        data: {
            country,
            allPackages
        }
    });

}

exports.postCompanyAPI = async (req, res, next) => {
    try {
        const userId = req.userId;

        // Use the uploaded file if it exists
        const imageUrl = req.file ? req.file.filename : '';

        const {
            first_name, last_name, company_name, email, password,
            country_id, state_id, city_id, address, status,
            phone, website, package_id, pincode, gst_no, pan_no
        } = req.body;

        // Optional: hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            first_name,
            last_name,
            company_name,
            email,
            password: hashedPassword, // Use hashedPassword if hashing
            country_id,
            state_id,
            city_id,
            address,
            status,
            phone,
            website,
            package_id,
            pincode,
            gst_no,
            pan_no,
            photo: imageUrl ? `/img/user-profile/${imageUrl}` : '',
            company_id: 0,
            master_company_id: 0,
            parent_company_id: 0,
            created_by: userId
        });

        await user.save();

        res.status(200).json({
            status: 'Success',
            statusCode: 200,
            message: 'Company created successfully',
        });
    } catch (error) {
        next(error);
    }
};

exports.checkEmailCompanyAPI = async (req, res, next) => {
    const email = req.params.email;
    const id = req.params.id;

    const query = { email: email };
    if (id && id !== 'null' && id !== 'undefined') {
        query._id = { $ne: id };
    }

    const userExist = await User.findOne(query);
    res.json({ exists: !!userExist }); // returns { exists: true } or { exists: false }
};

exports.editCompanyAPI = async (req, res, next) => {
    try {

        const userId = req.userId;
        const companyId = req.params.id;

        const company = await User.findOne({ _id: companyId, created_by: userId });

        if (!company) {
            return res.status(404).json({
                status: "Error",
                statusCode: 404,
                message: "Company not found or access denied",
            });
        }

        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Data fetched successfully",
            data: company,
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({
            status: "Error",
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

exports.putCompanyAPI = async (req, res, next) => {
    try {
        const userId = req.userId;
        const id = req.params.id;

        const data = await User.findOne({ created_by: userId, _id: id });

        const imageUrl = req.file ? req.file.filename : '';

        const {
            first_name, last_name, company_name, email,
            country_id, state_id, city_id, address, status,
            phone, website, package_id, pincode, gst_no, pan_no
        } = req.body;

        data.first_name = first_name;
        data.last_name = last_name;
        data.company_name = company_name;
        data.email = email;
        data.phone = phone;
        data.address = address;
        data.pincode = pincode;
        data.package_id = package_id;
        data.country_id = country_id;
        data.state_id = state_id;
        data.city_id = city_id;
        data.gst_no = gst_no;
        data.pan_no = pan_no;
        data.website = website;
        data.status = status;

        if (imageUrl && imageUrl != '') {
            data.photo = imageUrl;
        }

        await data.save();

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Company updated successfully!",
        })

    } catch (error) {
        console.error("Error occured", error);
    }
}

exports.getCountryAPI = async (req, res, next) => {
    const country = await Country.find();
    res.json({
        status: "Success",
        statusCode: 200,
        message: "Data fetched successfully",
        data: {
            country
        }
    });

}