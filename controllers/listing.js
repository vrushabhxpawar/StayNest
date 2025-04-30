const Listing = require("../Models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN ;
const geoCodingClient = mbxGeocoding({ accessToken : mapToken });

module.exports.showListing = wrapAsync(async (req, res) => {
  let listings = await Listing.find({});
  res.render("./Listing/index.ejs", { listings });
});

module.exports.renderNewListingForm = (req, res) => {
  res.render("./Listing/new.ejs");
};

module.exports.renderEditForm = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const item = await Listing.findById(id);
  if (!item) {
    req.flash("error", "Listing you are searching, does not exsists!!");
    res.redirect("/listing");
  }
  let originalImageUrl = item.image.url;
  originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250');
  console.log(originalImageUrl);
  res.render("./Listing/edit.ejs", { item , originalImageUrl});
});

module.exports.deleteListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted succesfully!");
  res.redirect("/listing");
});

module.exports.listingCreated = wrapAsync(async (req, res, next) => {
  let response = await geoCodingClient.forwardGeocode({
    query : req.body.listing.location,
    limit : 1,
  })
  .send();

  
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = req.body.listing;
  newListing.owner = req.user._id;
  newListing.image = {url , filename};
  newListing.geometry = response.body.features[0].geometry;
 
  await Listing.insertOne(newListing);
  console.log(newListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listing");
});

module.exports.individualListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let item = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!item) {
    req.flash("error", "Listing you are searching, does not exsists!!");
    res.redirect("/listing");
  }
  res.render("./Listing/view.ejs", { item });
});

module.exports.updateListing = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing }, {new : true, runValidators : true});
  console.log(listing);
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
    }
 
  req.flash("success", "List updated Successfully!");
  res.redirect(`/listing/${id}`);

});
