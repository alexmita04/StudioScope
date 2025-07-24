const Agency = require("./models/agency");
const Review = require("./models/review");
const { agencySchema, reviewSchema } = require("./schemas");

exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }

  req.session.returnTo = req.originalUrl;

  return res.status(401).send("Unauthorized: Please log in."); // add custom logic
};

exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    delete req.session.returnTo;
  }
  next();
};

exports.isAuthor = async (req, res, next) => {
  const { id } = req.params.id;
  const agency = await Agency.findById(id);
  if (agency.author.equals(req.user._id)) {
    // add a flash message
    res.redirect("/");
  }

  next();
};

exports.isAuthorReview = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Nu ai permisiuni sa faci acest lucru!");
    return res.redirect(`/agencies/${id}`);
  }

  next();
};

exports.validateReview = function (req, res, next) {
  const result = reviewSchema.validate(req.body);

  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    next(Error("err")); // add express error
  }

  next();
};

exports.validateAgency = function (req, res, next) {
  const result = agencySchema.validate(req.body);

  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    next(Error("err")); // add express error
  }

  next();
};
