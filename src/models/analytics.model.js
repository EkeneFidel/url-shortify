const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

// Define analytics schema
const analyticsSchema = new Schema({
    totalVisits: {
        type: Number,
        default: 0,
    },
    totalQrcodes: {
        type: Number,
        default: 0,
    },
    totalLinks: {
        type: Number,
        default: 0,
    },
    totalCountries: {
        type: Number,
        default: 0,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
});
const analyticsModel = mongoose.model("analytics", analyticsSchema);
module.exports = analyticsModel;
