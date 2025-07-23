const taskController = require("../controllers/taskController");
const taskService = require("../services/taskService");

// Mock the service methods
jest.mock("../services/taskService");

describe("taskController unit tests", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createTask", () => {
    it("should return the created task on success", async () => {
      const mockTask = { id: 1, title: "Test", description: "Desc", status: "incomplete" };
      req.body = { title: "Test", description: "Desc" };
      taskService.createTask.mockResolvedValue(mockTask);

      await taskController.createTask(req, res);

      expect(taskService.createTask).toHaveBeenCalledWith("Test", "Desc", undefined);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 500 on service error", async () => {
      req.body = { title: "Test", description: "Desc" };
      taskService.createTask.mockRejectedValue(new Error("DB Error"));

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to create task" });
    });
  });

  describe("getRecentIncompleteTasks", () => {
    it("should return recent incomplete tasks", async () => {
      const mockTasks = [{ id: 1 }, { id: 2 }];
      taskService.getRecentIncompleteTasks.mockResolvedValue(mockTasks);

      await taskController.getRecentIncompleteTasks(req, res);

      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should return 500 on error", async () => {
      taskService.getRecentIncompleteTasks.mockRejectedValue(new Error("Query error"));

      await taskController.getRecentIncompleteTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch tasks" });
    });
  });

  describe("updateTaskStatus", () => {
    it("should return updated task if found", async () => {
      req.params = { id: "1" };
      const mockTask = { id: 1, status: "complete" };
      taskService.updateTaskStatus.mockResolvedValue(mockTask);

      await taskController.updateTaskStatus(req, res);

      expect(taskService.updateTaskStatus).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 404 if task not found or already complete", async () => {
      req.params = { id: "999" };
      taskService.updateTaskStatus.mockResolvedValue(undefined);

      await taskController.updateTaskStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Task not found or already complete" });
    });

    it("should return 500 on error", async () => {
      req.params = { id: "1" };
      taskService.updateTaskStatus.mockRejectedValue(new Error("Update error"));

      await taskController.updateTaskStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to update task status" });
    });
  });
});
