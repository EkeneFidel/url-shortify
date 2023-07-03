const express = require("express");
const userRouter = express.Router();
const {
    updateUser,
    getOneUser,
    getAllUsers,
    deleteUser,
} = require("../controllers/user.controllers");

userRouter.get("/", getAllUsers);
userRouter.delete("/", deleteUser);
userRouter.put("/", updateUser);
userRouter.get("/profile", getOneUser);

module.exports = userRouter;
