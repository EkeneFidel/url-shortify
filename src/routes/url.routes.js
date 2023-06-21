const express = require("express");
const urlRouter = express.Router();

const {
    shortenUrl,
    getAllUrls,
    getQRCode,
} = require("../controllers/url.controllers");

urlRouter.post("/shorten", shortenUrl);
urlRouter.get("/all", getAllUrls);
urlRouter.get("/qrcode", getQRCode);

module.exports = urlRouter;
