const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isGuest, isAuthenticated } = require("../middleware/authMiddleware");

router.get("/login", isGuest, (req, res) => res.render("login"));
router.get("/register", isGuest, (req, res) => res.render("register"));
router.post("/register", isGuest, authController.register);
router.post("/login", isGuest, authController.login);
router.post("/logout", isAuthenticated, authController.logout);

module.exports = router;
