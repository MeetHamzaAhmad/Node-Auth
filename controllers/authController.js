const User = require("../models/User");
const jwt = require("jsonwebtoken");

//handle errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  console.log(err);

  //Incorrect email
  if (err.message === "Incorrect Email") {
    errors.email = "Please enter correct email";
  }
  //Incorrect Password
  if (err.message === "Incorrect Password") {
    errors.password = "Please enter correct Password";
  }

  //duplicate error code
  if (err.code === 11000) {
    errors.email = "Email already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "Secret string", {
    expiresIn: maxAge,
  });
};
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // console.log(user);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(404).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  console.log('route hit')
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
