const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAuthToken = function (user) {
    const token = jwt.sign(
        {
            id: user._id,
            name: user.userName,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
    return token;
};

const verifyToken = (req, res, next) => {
    const sessionToken = req.session.token;
    if (!sessionToken) {
        return res.redirect("auth?type=login");
    }

    let token = sessionToken;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.redirect("auth?type=login");
    }
    next();
};
module.exports = { verifyToken, generateAuthToken };
