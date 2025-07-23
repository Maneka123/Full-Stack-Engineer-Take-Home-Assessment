const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/", taskController.createTask);
router.get("/", taskController.getRecentIncompleteTasks);
router.put("/:id/status", taskController.updateTaskStatus);

module.exports = router;
