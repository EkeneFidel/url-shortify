const express = require("express");
const emailRouter = express.Router();
const {
    verifyEmail,
    verifiedEmail,
    resendVerificationEmail,
} = require("../controllers/auth.controllers");

emailRouter.post("/:userId", verifyEmail);
emailRouter.get("/:userId", verifiedEmail);
emailRouter.post("/resend-verification/:userId", resendVerificationEmail);

module.exports = emailRouter;
