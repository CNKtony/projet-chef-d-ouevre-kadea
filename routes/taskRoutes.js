const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { isAuthenticated } = require("../middleware/authMiddleware");

// Routes pour les tâches
router.get("/:date", isAuthenticated, taskController.getTasksForDay);
router.post("/add", isAuthenticated, taskController.addTask);
router.post("/update/:id", isAuthenticated, taskController.updateTask);
router.post("/delete/:id", isAuthenticated, taskController.deleteTask);

module.exports = router;
