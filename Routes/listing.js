const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
router.get("/new", isLoggedIn, listingControllers.renderNewListingForm);
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(listingControllers.showListing)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    listingControllers.listingCreated
  );

router
  .route("/:id")
  .get(listingControllers.individualListing)
  .put(isLoggedIn,  upload.single("listing[image]"),validateListing, listingControllers.updateListing)
  .delete(isLoggedIn, isOwner, listingControllers.deleteListing);

router.get("/:id/edit", isLoggedIn, isOwner, listingControllers.renderEditForm);

module.exports = router;
