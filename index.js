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
const userRouter = require("./routes/user");
const agencyRouter = require("./routes/agency");
const reviewRouter = require("./routes/review");

main().catch((err) => console.log(err));

async function main() {
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

app.use("/users", userRouter);
app.use("/agencies", agencyRouter);
app.use("/agencies/:id/reviews", reviewRouter);

app.get("/", (req, res, next) => {
  res.send("hello from the server!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
