const express = require("express");
const catchAsync = require("../utility/catchAsync");
const userController = require("../controllers/user");
const router = express.Router();

router
  .route("/login")
  .get(catchAsync(userController.getLogin))
  .post(catchAsync(userController.login));

router
  .route("/register")
  .get(catchAsync(userController.getRegister))
  .post(catchAsync(userController.register));

router.route("/logout").post(catchAsync(userController.logout));

module.exports = router;
