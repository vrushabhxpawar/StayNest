const Listing = require("../Models/listing.js");

module.exports.searchListing = async (req, res) => {
  const query = req.query.query?.trim();

  if (!query) {
    req.flash("error", "Please enter a valid search.");
    return res.redirect("/listing");
  }

  try {
    const listings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } }
      ]
    });

    res.render("Listing/search", { listings, query });

  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.filterlistings = async( req, res) => {
  const { category } = req.params;

  const validCategories = ["Mountains", "Beaches", "Pools", "Arctic", "Farms", "Lakes", "Castles", "Rooms"];
   if (!validCategories.includes(category)) {
    return res.status(404).send("Invalid category");
  }

   const listings = await Listing.find({ category });
   res.render("./Listing/filter.ejs", { listings, category });
}