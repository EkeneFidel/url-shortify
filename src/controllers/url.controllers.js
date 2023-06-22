const validUrl = require("valid-url");
const QRCode = require("qrcode");
const { customAlphabet } = require("nanoid");
require("dotenv").config();

const urlModel = require("../models/url.model");
const redisClient = require("../config/redis.config");

const shortenUrl = async (req, res, next) => {
    try {
        const baseUrl = process.env.BASE_URL;
        const userId = req.user.id;
        const nanoid = customAlphabet(
            "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            7
        );
        const { longUrl, customCode, title } = req.body;
        if (validUrl.isUri(longUrl)) {
            let shortUrl = "";
            let urlCode = nanoid(7);
            if (customCode) {
                urlCode = customCode;
                const urlCodeExists = await urlModel.findOne({
                    urlCode: customCode,
                });
                if (urlCodeExists) {
                    return res.status(400).json({
                        message: "Code already exists",
                        success: false,
                    });
                }
            }
            shortUrl = baseUrl + "/" + urlCode;
            const urlData = await urlModel.create({
                longUrl,
                shortUrl,
                urlCode,
                userId,
            });
            return res.status(200).json({
                success: true,
                message: "short url created",
                data: urlData,
            });
        } else {
            return res.status(400).json({
                message: "Invalid url provided",
                success: false,
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};

const getAllUrls = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cachedUrls = await redisClient.get(`urls:${userId}`);
        if (cachedUrls) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedUrls),
            });
        }
        const urls = await urlModel.find({ userId });
        await redisClient.set(`urls:${userId}`, JSON.stringify(urls), {
            EX: 1800,
            NX: true,
        });
        return res.status(200).json({
            success: true,
            data: urls,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};

const getQRCode = async (req, res, next) => {
    const urlCode = req.body.urlCode;
    const urlCodeExists = await urlModel.findOne({
        urlCode,
    });
    if (!urlCodeExists) {
        return res.status(400).json({
            message: "url code does not exist",
            success: false,
        });
    }
    if (urlCodeExists.qrcode) {
        return res.status(200).json({
            message: "QRcode generated",
            success: true,
            data: urlCodeExists.qrcode,
        });
    } else {
        const qrcode = await QRCode.toDataURL(urlCodeExists.shortUrl);
        const updatedUrl = await urlModel.findOneAndUpdate(
            {
                urlCode,
            },
            { qrcode },
            { new: true }
        );
        return res.status(200).json({
            message: "QRcode generated",
            success: true,
            data: updatedUrl,
        });
    }
};

module.exports = { shortenUrl, getAllUrls, getQRCode };
