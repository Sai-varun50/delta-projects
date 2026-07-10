const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const { isowner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapasync(listingController.index))
.post(isLoggedIn, validateListing,upload.single("listing[image]"), wrapasync(listingController.createListing))

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapasync(listingController.showListing))
.put(isLoggedIn, isowner, validateListing,upload.single("listing[image]"), wrapasync(listingController.updateListing))
.delete(isLoggedIn, isowner, wrapasync(listingController.destroyListing));


router.get("/:id/edit", isLoggedIn, isowner, wrapasync(listingController.renderEditForm));




module.exports = router;