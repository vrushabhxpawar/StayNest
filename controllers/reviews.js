const Listing = require('../Models/listing.js');
const Review = require('../Models/reviews.js');
const wrapAsync = require('../utils/wrapAsync.js');


module.exports.newReview =  wrapAsync (async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview.author);
  await newReview.save();
  listing.review.push(newReview);
  await listing.save();
  req.flash('success', 'Review added successfully!');
  res.redirect(`/listing/${listing._id}`);
})

module.exports.deleteReview =  wrapAsync( async(req, res, next)=> {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull : {review : reviewId}});
  req.flash('success', 'Review deleted successfully!');
  res.redirect(`/listing/${id}`)
})