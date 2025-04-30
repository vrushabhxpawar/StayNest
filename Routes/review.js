const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

router.post("/", isLoggedIn, validateReview, reviewControllers.newReview);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  reviewControllers.deleteReview
);

module.exports = router;
