if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config.env" });
  console.log(process.env.PORT);
}

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

main().catch((err) => console.log(err));

async function main() {
  // await mongoose.connect(
  //   `mongodb://${process.env.DB_USERNAME}:${process.envDB_PASSWORD}@127.0.0.1:27017/StudioScope`
  // );

  await mongoose.connect(
    `mongodb+srv://alexmita04:${process.env.DB_PASSWORD}@cluster0.9mcrbtl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
}

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
