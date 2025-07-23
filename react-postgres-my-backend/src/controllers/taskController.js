const taskService = require("../services/taskService");

// Controller to create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await taskService.createTask(title, description, status);
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Controller to fetch the 5 most recent incomplete tasks
const getRecentIncompleteTasks = async (req, res) => {
  try {
    const tasks = await taskService.getRecentIncompleteTasks();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Controller to update a task's status to 'complete'
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTaskStatus(id);
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found or already complete" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Failed to update task status" });
  }
};

// Export all controller functions as a module
module.exports = {
  createTask,
  getRecentIncompleteTasks,
  updateTaskStatus,
};
