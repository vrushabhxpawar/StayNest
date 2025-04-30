const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const reviewSchema = new mongoose.Schema({
  comment : {
    type : String
  },
  rating : {
    type : Number,
    min : 1,
    max : 5
  },
  created_at : {
    type : Date,
    default : Date.now()
  },
  author : {
    type : Schema.Types.ObjectId ,
    ref : 'User'
  }
})

module.exports = mongoose.model('Review', reviewSchema);