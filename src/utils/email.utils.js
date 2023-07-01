const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
require("dotenv").config();

const verificationModel = require("../models/verification.model");
const userModel = require("../models/user.model");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

const sendEmail = async (user, payload) => {
    try {
        const mailOptions = {
            from: `"Shortify" <${process.env.GMAIL_EMAIL}>`,
            to: user.email,
            subject: payload.subject,
            html: payload.message,
            text: payload.message,
            list: {
                unsubscribe: {
                    url: process.env.GMAIL_EMAIL,
                    comment: "Unsubscribe",
                },
            },
        };
        await transporter.sendMail(mailOptions);
        return {
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

const sendVerificationEmail = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return {
                success: false,
                message: `Your email is not registered`,
            };
        }

        if (user.isVerified) {
            return {
                success: false,
                message: "Your email has been verified",
            };
        }

        await verificationModel.findOneAndDelete({
            userId: userId,
        });

        const uniqueString = uuidv4() + userId;
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

        const newVerification = await verificationModel.create({
            userId: userId,
            hashedUniqueString: hashedUniqueString,
            expiresAt: Date.now() + 24 * (60 * 60 * 1000),
        });
        const payload = {
            message: `<p>Verify your email address to complete the signup process</p></br><p>This link <b>expires in 24 hours</b></p> </br> <p>Click <a href=${process.env.BASE_URL}/verify-email/${userId}?token=${uniqueString}>here</a> to proceed</p>`,
            subject: "Verify your Email",
        };
        let { success, message } = await sendEmail(user, payload);
        if (!success) {
            return {
                success: false,
                message: message,
            };
        } else {
            return {
                success: true,
                message: `Verification email sent to ${user.email}`,
                verificationToken: uniqueString,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Unable to send verification link",
        };
    }
};

module.exports = {
    transporter,
    sendEmail,
    sendVerificationEmail,
};
