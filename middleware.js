const Listing = require('./Models/listing.js');
const Review = require('./Models/reviews.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema, reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) =>{
  if(!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be logged in!!');
    return res.redirect('/login');
  }
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
    req.flash('error', 'You do not have permission!');
    return  res.redirect(`/listing/${id}`);
}
next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } =listingSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, msg);
  }else{
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(404, error);
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async(req, res, next) => {
  let{ id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)){
    req.flash('error', 'You do not have permission!');
    return  res.redirect(`/listing/${id}`);
}
  next();
}