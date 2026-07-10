const express = require("express");
// const router = express.Router();

const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/expressError.js")
// const { listingSchema , reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controller/review.js")




// post review

router.post("/", isLoggedIn, validateReview , wrapasync(reviewController.createReview));

// delete review

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapasync(reviewController.deleteReview));

module.exports = router;