require("dotenv").config();
const mongoose = require("mongoose");

const isValidId = function (id) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw Error("id is not valid");
    }
    return;
};

module.exports = { isValidId };
