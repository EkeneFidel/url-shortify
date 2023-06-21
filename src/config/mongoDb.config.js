const mongoose = require("mongoose");
require("dotenv").config();

function connectToMongoDB() {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = mongoose.connection;

    db.on("connected", () => {
        console.log("Connected to database successfully !");
    });

    db.on("error", (err) => {
        console.log("An error occured while connecting to the database");
    });
}

module.exports = { connectToMongoDB };
