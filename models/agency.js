const mongoose = require("mongoose");
const { Schema } = mongoose;

const CATEGORY_ENUM = [
  "Branding",
  "UX Design",
  "UI Design",
  "Web Development",
  "Strategy",
  "Content Creation",
  "Social Media",
  "Motion Graphics",
  "Advertising",
  "Market Research",
];

const serviceSchema = Schema({
  name: {
    type: String,
    required: [true, "A service must have a name!"],
  },
  description: {
    type: String,
    required: [true, "A service must have a description!"],
  },
  imageUrl: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "A service must have a price!"],
  },
});

const agencySchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "An agency must have a name!"],
  },
  description: {
    type: String,
    required: [true, "An agency must have a description!"],
  },
  imageUrl: { type: String },
  categories: {
    type: [String],
    validate: [
      {
        validator: function (arr) {
          return arr.length === 4;
        },
        message: "Exactly 4 categories must be selected.",
      },
      {
        validator: function (arr) {
          return new Set(arr).size === arr.length;
        },
        message: "Duplicate categories are not allowed.",
      },
      {
        validator: function (arr) {
          return arr.every((cat) => CATEGORY_ENUM.includes(cat));
        },
        message: `All categories must be one of the allowed options: ${CATEGORY_ENUM.join(
          ", "
        )}`,
      },
    ],
  },
  services: {
    type: [serviceSchema],
    validate: [
      {
        validator: function (arr) {
          return arr.length >= 1 && arr.length <= 6;
        },
        message: "An agency must offer between 1 and 6 services!",
      },
    ],
  },
  contact: {
    email: {
      type: String,
      required: ["true", "An agency must have an email!"],
    },
    phoneNumber: {
      type: String,
      required: ["true", "An agency must have a phone number!"],
    },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;
