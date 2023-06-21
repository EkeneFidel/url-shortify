const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

require("dotenv").config();

const db = require("./src/config/mongoDb.config");
const urlRouter = require("./src/routes/url.routes");
const urlModel = require("./src/models/url.model");
const getLocation = require("./src/utils/getLocation");

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/url", urlRouter);
app.get("/", async (req, res) => {
    res.send();
});
app.get("/:urlCode", async (req, res) => {
    const urlCode = req.params.urlCode;
    const country = await getLocation(req.ip);
    console.log(country);
    const urlData = await urlModel.findOneAndUpdate(
        { urlCode },
        {
            $inc: { visits: 1 },
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                    location: "Nigeria",
                },
            },
        },
        { new: true }
    );
    if (urlData) {
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
