const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main().then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});


async function main () {
    await mongoose.connect(MONGO_URL)
}

const initDB = async() => {
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: "64a7e1f5c0d3b8e4f8a9b1c2"}));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();