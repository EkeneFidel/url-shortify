const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const userModel = require("../models/user.model");
const analyticsModel = require("../models/analytics.model");
const tokenModel = require("../models/token.model");
const verificationModel = require("../models/verification.model");
const { generateAuthToken } = require("../utils/auth.utils");
const { isValidId } = require("../utils/db.utils");
const { sendEmail } = require("../utils/email.utils");
const { sendVerificationEmail } = require("../utils/email.utils");

const getAuthPage = (req, res, next) => {
    let { type } = req.query;
    if (req.session.isLogged) {
        res.redirect("/dashboard");
    } else {
        res.render("auth", { type });
    }
};

const signup = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.json({
                success: false,
                message: "Credentials incomplete",
            });
        }
        const user = await userModel.create({ userName, email, password });
        await analyticsModel.create({ userId: user._id });
        const { message, verificationToken } = await sendVerificationEmail(
            user._id
        );
        return res.status(200).json({
            success: true,
            message: message,
        });
    } catch (error) {
        let user = await userModel.findOne({ email: req.body.email });
        await userModel.findOneAndDelete({ _id: user._id });
        await analyticsModel.findOneAndDelete({ userId: user._id });
        await verificationModel.findOneAndDelete({ userId: user._id });
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password, remember } = req.body;
        if (!email) {
            return res.json({
                success: false,
                message: "Provide an email",
            });
        }

        if (!password) {
            return res.json({
                success: false,
                message: "Provide a password",
            });
        }

        const user = await userModel.findOne({
            email: email,
        });

        if (!user) {
            return res.json({
                success: false,
                message: "user does not exist",
            });
        }
        if (user.isVerified) {
            const validate = await user.isValidPassword(password);

            if (!validate) {
                return res.status(401).json({
                    success: false,
                    message: "Password incorrect",
                });
            }
            const token = generateAuthToken(user);

            if (remember) {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 3;
            }
            req.session.token = token;
            req.session.isLogged = true;
            req.session.user = user.userName;
            req.session.save();
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
        } else {
            return res.status(400).json({
                success: false,
                message: "Email has not been verified, check your inbox",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
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

const getForgotPasswPage = async (req, res, next) => {
    res.render("forgot-password");
};

const verifyEmail = async (req, res, next) => {
    try {
        const { userId } = req.params;
        isValidId(userId);
        const { token } = req.query;
        const verification = await verificationModel.find({ userId: userId });
        if (!verification.length) {
            return res.status(400).json({
                success: false,
                message: "Email not found or has been verified already",
            });
        }
        const { expiresAt, hashedUniqueString } = verification[0];
        if (expiresAt < Date.now()) {
            await verificationModel.findOneAndDelete({ userId: userId });

            return res.status(400).json({
                type: "login",
                success: false,
                message: "Verification link has expired",
            });
        }

        const compareString = await bcrypt.compare(token, hashedUniqueString);
        if (compareString) {
            await userModel.findByIdAndUpdate(userId, { isVerified: true });
            await verificationModel.findOneAndDelete({ userId: userId });
            return res.status(200).json({
                type: "login",
                success: true,
                message: "Your email has been verified",
            });
        } else {
            return res.status(400).json({
                type: "login",
                success: false,
                message: "There is an error with the verification link",
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            type: "login",
            success: false,
            message: "There is an error with the verification link",
        });
    }
};

const verifiedEmail = async (req, res, next) => {
    try {
        const { userId } = req.params;
        res.render("verified");
    } catch (error) {}
};

const resendVerificationEmail = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status, message, verificationToken } =
            await sendVerificationEmail(userId);
        if (!status) {
            throw Error(`${message}`);
        }
        return res.status(200).json({
            success: true,
            message: message,
            userId: userId,
            verificationToken: verificationToken,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const requestPasswordReset = async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user)
        return res.status(400).json({
            success: false,
            message: "user does not exist",
        });

    let token = await tokenModel.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = await bcrypt.hash(resetToken, 10);

    await tokenModel.create({
        userId: user._id,
        token: passwordResetToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * (60 * 60 * 1000),
    });

    const link = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}&id=${user._id}`;

    const payload = {
        subject: "Password Reset Request",
        message: `<p>Hi ${user.userName},</p>
        <p>You requested to reset your password.</p>
        </br><p>This link <b>expires in 24 hours</b></p> </br>
        <p> Please, click the link below to reset your password</p>
        <a href="${link}">Reset Password</a>`,
    };
    let { success, message } = await sendEmail(user, payload);
    if (!success) {
        return res.status(200).json({
            success: false,
            message: message,
        });
    }
    return res.status(200).json({
        success: true,
        message: "Password reset email sent",
    });
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, id } = req.query;
        isValidId(id);
        const { password } = req.body;
        let passwordResetToken = await tokenModel.findOne({ userId: id });
        let user = await userModel.findOne({ _id: id });
        if (!passwordResetToken) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired password reset token",
            });
        }

        if (passwordResetToken.expiresAt < Date.now()) {
            await passwordResetToken.deleteOne();

            return res.status(403).json({
                success: false,
                message: "password reset token has expired",
            });
        }

        const isValid = await bcrypt.compare(token, passwordResetToken.token);

        if (!isValid) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired password reset token",
            });
        }

        const hash = await bcrypt.hash(password, 10);

        await userModel.updateOne(
            { _id: id },
            { $set: { password: hash } },
            { new: true }
        );

        await passwordResetToken.deleteOne();
        const payload = {
            subject: "Password Reset Successfully",
            message: `<p>Hello ${user.userName},</p>
            <p>Your password has been changed successfully</p>`,
        };
        await sendEmail(user, payload);
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getResetPasswPage = async (req, res, next) => {
    res.render("change-password");
};

const renderPasswordChanged = async (req, res, next) => {
    res.render("changed");
};

module.exports = {
    signup,
    login,
    changePassword,
    getAuthPage,
    getForgotPasswPage,
    verifyEmail,
    verifiedEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    getResetPasswPage,
    renderPasswordChanged,
};
