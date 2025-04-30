const mongoose = require('mongoose');
const Listing = require('../Models/listing.js');
const initData = require('./data.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {console.log('DB connected.')}).catch((err) => {console.log(err)})

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  modifiedData = initData.data.map((obj) => ({...obj , owner : '68037676c5d6b7198d2ebfd2'}));
  await Listing.insertMany(modifiedData);
  console.log('DB initalized');
}

initDB();