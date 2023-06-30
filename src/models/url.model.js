const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

// Define url schema
const urlSchema = new Schema(
    {
        shortUrl: {
            type: String,
        },
        urlCode: {
            type: String,
            unique: true,
        },
        longUrl: {
            type: String,
            unique: true,
            required: true,
        },
        visits: {
            type: Number,
            required: true,
            default: 0,
        },
        visitHistory: [{ timestamp: Date, location: String }],
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        qrcode: {
            type: String,
        },
    },
    { timestamps: true }
);
const urlModel = mongoose.model("Url", urlSchema);
module.exports = urlModel;
