require("dotenv").config();

const urlModel = require("../models/url.model");

const getAllLinks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        res.render("links", { user: req.user });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};

module.exports = { getAllLinks };
