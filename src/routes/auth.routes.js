const express = require("express");
const { render } = require("../../app");
const {
    signup,
    login,
    changePassword,
    getAuthPage,
} = require("../controllers/auth.controllers");
const { checkUser } = require("../middlewares/user.validation");
const { verifyToken } = require("../utils/auth.utils");

const authRouter = express.Router();

authRouter.get("", getAuthPage);
authRouter.post("/signup", checkUser, signup);
authRouter.post("/login", login);
authRouter.post("/change-password", verifyToken, changePassword);

module.exports = authRouter;
