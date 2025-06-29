const User = require("../model/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");

module.exports = {
  hello() {
    return {
      text: "Hello world!",
      views: 12345,
    };
  },

  createUser: async function ({ userInput }, req) {
    const { email, name, password, status } = userInput;

    const error = [];

    if (!validator.isEmail(email)) {
      error.push({ message: "Email is required" });
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      error.push({ message: "Password too short" });
    }

    if (error.length > 0) {
      const errors = new Error("Invalid input");
      errors.data = error;
      errors.code = 422;
      throw errors;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      name,
      status: status,
      password: hashedPassword,
      status: "I am new!",
      posts: [],
    });

    const createdUser = await user.save();

    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  },
};
