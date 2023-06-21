const express = require("express");
const userModel = require("../models/user.model");

const checkUser = async (req, res, next) => {
    //search the database to see if user exist
    try {
        //checking if email already exist
        const email = await userModel.findOne({
            email: req.body.email,
        });

        //if email exist in the database respond with a status of 409
        if (email) {
            return res.status(400).json({
                success: false,
                message: "email already registered",
            });
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

//exporting module
module.exports = {
    checkUser,
};
