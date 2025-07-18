const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Review = require('./reviews.js')

const listingSchema = new mongoose.Schema({
  title : {
    type : String
  },
  description : {
    type : String
  },
  image : {
    url : String,
    filename : String,
  },
  price : {
    type : Number
  },
  location : {
    type : String
  },
  country : {
    type : String
  },
  review: [
    {
      type : Schema.Types.ObjectId,
      ref : 'Review',
      default: []
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  geometry: {
    type : {
      type : String,
      enum : ["Point"],
      required : true
    },
    coordinates : {
      type : [Number],
      required : true
    }
  },
  category : {
    type : String,
    enum : ["Mountain", "Beach", "Pool", "Snowland", "Farm", "Lake", "Castle" , "Room", "Iconic-City", "Camping", "Worship", "Forest"]
  }
})

listingSchema.post('findOneAndDelete', async(listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in : listing.review}})
  }
})

const Listing = new mongoose.model('Listing', listingSchema);
module.exports = Listing;
