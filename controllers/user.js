const User = require("../models/user");

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send("User already exists"); // add flash and redirect to login

    const newUser = new User({ username, password });
    await newUser.save();

    req.session.userId = newUser._id;
    res.status(201).send("User registerd"); //redirect to main page
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering user!"); // throw custom error through flash and redirect
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("invalid credentials"); // add flash and redirect

    if (!user.comparePassword(password))
      return res.status("400").send("invalid credentials"); // add flash and redirect

    req.session.userId = user._id;
    res.send("logged in");
  } catch (err) {
    res.status(500).send("Login error");
  }
};

exports.logout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Logout error");
    }
    res.clearCookie("connect.sid");
    res.send("Logged out");
  });
};
