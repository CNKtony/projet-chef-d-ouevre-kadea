const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, weatherController.getWeather);

module.exports = router;
