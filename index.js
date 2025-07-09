if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config.env" });
  console.log(process.env.PORT);
}

const express = require("express");
const mongoose = require("mongoose");

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
