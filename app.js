const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const ipaddrJs = require("ipaddr.js");
const path = require("path");
const redis = require("redis");
var session = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const db = require("./src/config/mongoDb.config");
const authRouter = require("./src/routes/auth.routes");
const urlRouter = require("./src/routes/url.routes");
const urlModel = require("./src/models/url.model");
const getLocation = require("./src/utils/getLocation");
const redisClient = require("./src/config/redis.config");
const { verifyToken } = require("./src/utils/auth.utils");

db.connectToMongoDB();
const PORT = process.env.PORT || 3000;
const app = express();

const apiRequestLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    statusCode: 429,
    headers: true,
});

app.set("trust proxy", true);
app.use(cors());
app.use(apiRequestLimiter);
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
    session({
        secret: process.env.JWT_SECRET,
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.set("views", path.join(__dirname, "/src/views"));

app.use("/url", verifyToken, urlRouter);
app.use("/auth", authRouter);
app.get("/dashboard", verifyToken, async (req, res) => {
    res.render("dashboard", { user: req.user });
});
app.get("/", async (req, res) => {
    if (req.session.isLogged) {
        res.redirect("/dashboard");
    } else {
        res.render("landing");
    }
});

app.get("/:urlCode", async (req, res) => {
    const ipStatus = ipaddrJs.parse(req.ip).range();
    const urlCode = req.params.urlCode;
    let country = "";
    if (ipStatus === "loopback") {
        country = "Nigeria";
    } else {
        const location = await getLocation(req.ip);
        country = location.addressCountry;
    }
    const urlData = await urlModel.findOneAndUpdate(
        { urlCode },
        {
            $inc: { visits: 1 },
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                    location: country,
                },
            },
        },
        { new: true }
    );
    if (urlData) {
        await redisClient.del(`urls:${urlData.userId}`);
        res.redirect(urlData.longUrl);
    }
});

// Handle errors.
app.use(function (err, req, res, next) {
    res.status(err.satus || 500);
    res.json({ message: err.message || "An error occured" });
    next();
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

module.exports = app;
