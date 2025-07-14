const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: [true, "A review must have a rating!"],
    min: [1, "A rating must be at least 1!"],
    max: [5, "A rating must be at most 5!"],
  },
  message: {
    type: String,
    required: [true, "A review must have a message!"],
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
