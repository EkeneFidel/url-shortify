const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define a schema
const Schema = mongoose.Schema;

// Define user schema
const verificationSchema = new Schema({
    hashedUniqueString: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
});

const verificationModel = mongoose.model("Verification", verificationSchema);
module.exports = verificationModel;
