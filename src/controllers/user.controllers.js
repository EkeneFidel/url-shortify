const userModel = require("../models/user.model");

const updateUser = async (req, res, next) => {
    try {
        const id = req.user.id;
        const userData = req.body;
        const user = await userModel.findById(id);
        if (user) {
            const updatedUser = await userModel
                .findByIdAndUpdate(id, userData, { new: true })
                .select(["-__v", "-password"]);
            return res.status(200).json({
                success: true,
                message: "user updated",
                user: updatedUser,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "user does not exist",
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};

const getOneUser = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await userModel.findById(id).select(["-__v", "-password"]);
        if (!user) {
            return res.status(400).json({
                message: "user not found",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            message: "user found",
            user: user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find().select(["-__v", "-password"]);
        return res.status(200).json({
            success: true,
            message: "users found",
            users: users,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await userModel.findById(id);
        if (user) {
            const deletedUser = await userModel
                .findByIdAndDelete(id)
                .select(["-__v", "-password"]);
            return res.status(200).json({
                success: true,
                message: "user deleted",
                user: deletedUser,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "user does not exist",
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};

module.exports = {
    updateUser,
    getOneUser,
    getAllUsers,
    deleteUser,
};
