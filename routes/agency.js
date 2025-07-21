const express = require("express");
const agencyController = require("../controllers/agency");
const catchAsync = require("../utility/catchAsync");
const router = express.Router();

router
  .route("/")
  .get(catchAsync(agencyController.getAllAgencies))
  .post(catchAsync(agencyController.createAgency));

router
  .route("/:id")
  .get(catchAsync(agencyController.getAgency))
  .put(catchAsync(agencyController.updateAgency))
  .delete(catchAsync(agencyController.deleteAgency));

module.exports = router;
