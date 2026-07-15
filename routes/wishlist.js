
const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware");
const wishlistController = require("../controller/wishlist");

router.get(
    "/",
    isLoggedIn,
    wishlistController.showWishlist
);

router.post(
    "/:id",
    isLoggedIn,
    wishlistController.addToWishlist
);

router.delete(
    "/:id",
    isLoggedIn,
     wishlistController.removeFromWishlist);

module.exports = router;