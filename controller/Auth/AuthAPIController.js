require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../model/User');
const jwtSecretKey = process.env.JWT_SECRET;
const validate = require('../../util/validation')
const expireTime = process.env.token_expire_time;
const { hash, normalizeEmail, decrypt } = require('../../util/encryption');

exports.postAPILogIn = (req, res, next) => {
    if (!validate(req, res)) return;

    const { email, password } = req.body;
    let loadedUser;
    User.findOne({ email_hash: hash(normalizeEmail(email)) })
        .then(user => {
            if (!user) {
                const error = new Error("A user with this email cannot be found!");
                error.statusCode = 401;
                throw error;
            }

            if (!user.status) {
                const error = new Error("Your account is deactivated!");
                error.statusCode = 400;
                throw error;
            }

            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Wrong password");
                error.statusCode = 401;
                throw error;
            }

            const expiresInSeconds = expireTime * 60 * 60; // convert to seconds
            const expirationTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;

            const token = jwt.sign(
                { email: loadedUser.email, userId: loadedUser._id.toString() },
                jwtSecretKey,
                { expiresIn: `${expireTime}h` }
            );
            
            res.status(200).json({
                status: "Success",
                statusCode: 200,
                message: "User logged in successfully!",
                token: token,
                expiresAt: expirationTimestamp,
                userId: loadedUser._id.toString(),
                email: decrypt(loadedUser.email),
                name: loadedUser.first_name + " " + loadedUser.last_name
            });
        })
        .catch(err => {
            next(err); // ✅ This ensures your error middleware gets it
        });
};