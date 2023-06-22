const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAuthToken = function (user) {
    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
    return token;
};

const verifyToken = (req, res, next) => {
    const authorization = req.header("Authorization");
    if (!authorization) {
        return res.status(403).json({
            succes: false,
            message: "Token required",
        });
    }

    let [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer") {
        return res.status(403).json({
            succes: false,
            message: "Bearer Token required",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({
            succes: false,
            message: error.message,
        });
    }
    next();
};
module.exports = { verifyToken, generateAuthToken };
