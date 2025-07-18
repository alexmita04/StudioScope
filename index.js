if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config.env" });
  console.log(process.env.PORT);
}

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/user");

main().catch((err) => console.log(err));

async function main() {
  // await mongoose.connect(
  //   `mongodb://${process.env.DB_USERNAME}:${process.envDB_PASSWORD}@127.0.0.1:27017/StudioScope`
  // );

  await mongoose.connect(
    `mongodb+srv://alexmita04:${process.env.DB_PASSWORD}@cluster0.9mcrbtl.mongodb.net/studio-scope?retryWrites=true&w=majority&appName=Cluster0`
  );
}

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  next(); // add custom error
}

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send("User already exists"); // add flash and redirect to login

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send("User registerd"); //redirect to main page
  } catch (err) {
    res.status(500).send("Error registering user!"); // throw custom error through flash and redirect
  }
});

app.post("/login", async (req, res) => {
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
});

app.post("/logout", (req, res) => {
  delete req.session.userId;
  res.send("logged out");
});

app.get("/", (req, res, next) => {
  res.send("hello from the server!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
