const express = require("express");
const urlRouter = express.Router();

const {
    shortenUrl,
    getAllUrls,
    getQRCode,
    deleteUrls,
    getUrlbyId,
} = require("../controllers/url.controllers");

urlRouter.post("/shorten", shortenUrl);
urlRouter.get("/all", getAllUrls);
urlRouter.get("/:id", getUrlbyId);
urlRouter.delete("/delete", deleteUrls);
urlRouter.post("/qrcode", getQRCode);

module.exports = urlRouter;
