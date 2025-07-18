const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "An user must have an username!"],
    minlength: [6, "Username must be at least 6 characters long."],
    maxlength: [25, "Username must be at most 25 characters long."],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "An user must have a password!"],
    minlength: [8, "Password must be at least 8 characters long."],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "agency"],
    default: "user",
    required: [true, "An user must have a role!"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
