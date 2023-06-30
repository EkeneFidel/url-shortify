const express = require("express");
const linkRouter = express.Router();

const { getAllLinks } = require("../controllers/link.controllers");

linkRouter.get("/", getAllLinks);

module.exports = linkRouter;
