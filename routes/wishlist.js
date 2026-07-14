
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


module.exports = router;