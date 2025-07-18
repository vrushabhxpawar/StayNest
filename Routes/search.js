const express = require("express");
const router = express.Router();
const searchControllers = require("../controllers/search.js");

router
  .route('/')
  .get(searchControllers.searchListing);

router  
  .route('/filter')
  .get(searchControllers.filterlistings);

module.exports = router;