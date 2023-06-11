const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  createUser: (args) => {
    const user = new User({
      email: args.userInput.email,
      password: args.userInput.password,
    });
    return user
      .save()
      .then((result) => {
        console.log(result);
        return { ...result._doc, _id: result.id };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }

    const isEqual = password == user.password;
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, "oldstkey", {
      expiresIn: "1h",
    });

    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
