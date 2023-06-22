const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const userModel = require("../models/user.model");
const tokenModel = require("../models/token.model");
const { generateAuthToken } = require("../utils/auth.utils");
const { isValidId } = require("../utils/db.utils");

const signup = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Credentials incomplete",
            });
        }
        const user = await userModel.create({ userName, email, password });
        return res.status(200).json({
            success: true,
            message: "User created",
            data: user,
        });
    } catch (error) {
        let user = await userModel.findOne({ email: req.body.email });
        await userModel.findOneAndDelete({ _id: user._id });
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(500).json({
                success: false,
                message: "Provide an email",
            });
        }

        if (!password) {
            return res.status(500).json({
                success: false,
                message: "Provide a password",
            });
        }

        const user = await userModel.findOne({
            email: email,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user does not exist",
            });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
            return res.status(401).json({
                success: false,
                message: "Password incorrect",
            });
        }
        const token = generateAuthToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                createdAt: user.createdAt,
            },
            token: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occured",
        });
    }
};

const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let user = await userModel.findById(userId);
        const { oldPassword, newPassword } = req.body;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found",
            });
        }
        const validate = await user.isValidPassword(oldPassword);
        if (!validate) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }
        if (newPassword) {
            user.password = newPassword;
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Password updated",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "New password not provided",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    signup,
    login,
    changePassword,
};
