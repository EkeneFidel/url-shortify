const express = require("express");
const {
    signup,
    login,
    changePassword,
    getAuthPage,
    getForgotPasswPage,
    requestPasswordReset,
    resetPassword,
    getResetPasswPage,
    renderPasswordChanged,
    logout,
} = require("../controllers/auth.controllers");
const { checkUser } = require("../middlewares/user.validation");
const { verifyToken } = require("../utils/auth.utils");

const authRouter = express.Router();

authRouter.get("", getAuthPage);
authRouter.post("/signup", checkUser, signup);
authRouter.post("/login", login);
authRouter.post("/logout", verifyToken, logout);
authRouter.post("/change-password", verifyToken, changePassword);
authRouter.get("/change-password", renderPasswordChanged);
authRouter.get("/forgot-password", getForgotPasswPage);
authRouter.post("/request-reset-password", requestPasswordReset);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/reset-password", getResetPasswPage);

module.exports = authRouter;
