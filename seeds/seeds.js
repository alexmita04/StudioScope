require("dotenv").config({
  path: require("path").resolve(__dirname, "../config.env"),
});

const Agency = require("../models/agency");
const User = require("../models/user");
const Review = require("../models/review");
const agencies = require("./seeds.json");
const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  // await mongoose.connect(
  //   `mongodb://${process.env.DB_USERNAME}:${process.envDB_PASSWORD}@127.0.0.1:27017/StudioScope`
  // );

  await mongoose.connect(
    `mongodb+srv://alexmita04:${process.env.DB_PASSWORD}@cluster0.9mcrbtl.mongodb.net/studio-scope?retryWrites=true&w=majority&appName=Cluster0`
  );
}

async function deleteSeedingDB() {
  try {
    for (let agency of agencies) {
      const foundAgency = await Agency.findOne({ name: agency.name })
        .populate("author")
        .populate({
          path: "reviews",
          populate: {
            path: "author",
            model: "User",
          },
        });
      if (foundAgency) {
        await Agency.findByIdAndDelete(foundAgency._id);
        if (foundAgency.author && foundAgency.author.username)
          await User.findOneAndDelete({
            username: foundAgency.author.username,
          });
        if (foundAgency.reviews.length) {
          for (const review of foundAgency.reviews)
            await Review.findByIdAndDelete(review._id);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function seedDB() {
  try {
    await deleteSeedingDB();

    for (let agency of agencies) {
      const newUser = new User({
        username: agency.author,
        password: process.env.SEED_PASSWORD,
        role: "agency",
      });
      await newUser.save();
      const newAgency = new Agency({ ...agency, author: newUser });
      await newAgency.save();
    }

    console.log("Seeding Done!");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seedDB();
