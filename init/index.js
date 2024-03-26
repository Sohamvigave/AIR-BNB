const mongoose = require("mongoose");

//requiring the data of DB from data.js file
const initData = require("./data.js");

//requiring the schema and module of DB
const Listing = require("../models/listing.js");

//connecting with database (DB name = "wanderlust")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

//initializing the DB 
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: '66026f845d0f55f4b8b063a3',
    }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();