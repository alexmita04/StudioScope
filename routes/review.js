const express = require("express");
const reviewController = require("../controllers/review");
const catchAsync = require("../utility/catchAsync");
const router = express.Router({ mergeParams: true });

router.route("/").post(catchAsync(reviewController.createReview));

router.route("/:reviewId").delete(catchAsync(reviewController.deleteReview));

module.exports = router;
