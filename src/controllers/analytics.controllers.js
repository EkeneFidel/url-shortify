require("dotenv").config();

const analyticsModel = require("../models/analytics.model");
const urlModel = require("../models/url.model");
const redisClient = require("../config/redis.config");

const getAnalytics = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cachedAnalytics = await redisClient.get(`analytics:${userId}`);
        if (cachedAnalytics) {
            return res.status(200).json({
                success: true,
                message: "Analytics gotten",
                data: JSON.parse(cachedAnalytics),
            });
        }

        let qrCodes = 0;
        let visits = 0;
        let countries = new Set();
        const urls = await urlModel.find({ userId });
        urls.forEach((url) => {
            if (url.qrcode) {
                qrCodes += 1;
            }
            if (url.visits) {
                visits += url.visits;
            }
            if (url.visitHistory.length) {
                url.visitHistory.forEach((item) => {
                    countries.add(item.location);
                });
            }
        });
        const analytics = await analyticsModel.findOneAndUpdate(
            { userId },
            {
                totalVisits: visits,
                totalQrcodes: qrCodes,
                totalLinks: urls.length,
                totalCountries: countries.size,
                userId: userId,
            },
            { new: true }
        );
        await redisClient.set(
            `analytics:${userId}`,
            JSON.stringify(analytics),
            {
                EX: 1800,
                NX: true,
            }
        );
        return res.status(200).json({
            success: true,
            message: "Analytics gotten",
            data: analytics,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

module.exports = { getAnalytics };
