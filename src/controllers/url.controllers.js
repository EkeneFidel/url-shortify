const validUrl = require("valid-url");
const QRCode = require("qrcode");
const { customAlphabet } = require("nanoid");
require("dotenv").config();

const urlModel = require("../models/url.model");
const redisClient = require("../config/redis.config");
const { removeTrailingSlash } = require("../utils/link.utils");

const shortenUrl = async (req, res, next) => {
    try {
        const baseUrl = process.env.BASE_URL;
        const userId = req.user.id;
        const nanoid = customAlphabet(
            "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            7
        );
        let { longUrl, customCode } = req.body;

        let protocol = longUrl.split("/")[0];
        let rest = longUrl.split(".");

        if (rest.length > 1 && rest[1] !== "") {
            if (protocol !== "https:" && protocol !== "http:") {
                longUrl = `https://${longUrl}`;
            }
            const longUrlExists = await urlModel.findOne({
                userId: userId,
                $or: [
                    { longUrl: longUrl },
                    { longUrl: removeTrailingSlash(longUrl) },
                ],
            });
            if (longUrlExists) {
                return res.status(409).json({
                    message:
                        "Looks like this long url is already used for another short link",
                    success: false,
                });
            }
            if (validUrl.isHttpsUri(longUrl) || validUrl.isHttpUri(longUrl)) {
                let shortUrl = "";
                let urlCode = nanoid(7);
                if (customCode) {
                    urlCode = customCode;
                    const urlCodeExists = await urlModel.findOne({
                        urlCode: customCode,
                    });
                    if (urlCodeExists) {
                        return res.status(409).json({
                            message: "Back half already exists",
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
                await redisClient.del(`urls:${urlData.userId}`);
                await redisClient.del(`analytics:${urlData.userId}`);
                return res.status(200).json({
                    success: true,
                    message: "short url created",
                    data: urlData,
                });
            }
        } else {
            return res.status(400).json({
                message: "Invalid url provided",
                success: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
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
        return res.status(500).json({
            message: "An error occured",
            success: false,
        });
    }
};

const getQRCode = async (req, res, next) => {
    try {
        const userId = req.user.id;
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
            await redisClient.del(`urls:${userId}`);
            await redisClient.del(`analytics:${userId}`);
            await redisClient.del(`url:${userId}:${updatedUrl._id}`);

            return res.status(200).json({
                message: "QRcode generated",
                success: true,
                data: updatedUrl.qrcode,
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "An error occured",
            success: false,
        });
    }
};

const deleteUrls = async (req, res, next) => {
    try {
        let { ids } = req.body;
        console.log(req.body);
        let userId = req.user.id;

        let count = await urlModel.deleteMany({
            _id: {
                $in: ids,
            },
        });
        await redisClient.del(`urls:${userId}`);
        await redisClient.del(`analytics:${userId}`);
        ids.forEach(async (id) => {
            await redisClient.del(`url:${userId}:${id}`);
        });
        return res.status(200).json({
            success: true,
            message: `Deleted ${count} ${count > 1 ? "url" : "urls"}`,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

const getUrlbyId = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const cachedUrl = await redisClient.get(`url:${userId}:${id}`);
        if (cachedUrl) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedUrl),
            });
        }

        const urlDetails = await urlModel.findById(id);

        if (urlDetails) {
            await redisClient.set(
                `url:${userId}:${id}`,
                JSON.stringify(urlDetails),
                {
                    EX: 1800,
                    NX: true,
                }
            );
            return res.status(200).json({
                success: true,
                data: urlDetails,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "url does not exist",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: error.message,
        });
    }
};

module.exports = { shortenUrl, getAllUrls, getQRCode, deleteUrls, getUrlbyId };
