const express = require("express");
const analyticsRouter = express.Router();

const { getAnalytics } = require("../controllers/analytics.controllers");

analyticsRouter.get("/data", getAnalytics);
analyticsRouter.get("/", async (req, res) => {
    res.render("analytics", { user: req.user });
});

module.exports = analyticsRouter;
