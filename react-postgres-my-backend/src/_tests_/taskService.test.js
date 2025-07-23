taskService = require("../services/taskService");
const pool = require("../db/pool");
// Mock the pool.query function
jest.mock("../db/pool", () => ({
  query: jest.fn(),
}));

describe("taskService unit tests", () => {
  afterEach(() => {
    jest.clearAllMocks();  // Reset mocks after each test
  });

  describe("createTask", () => {
    it("should insert a task with default status 'incomplete'", async () => {
      // Arrange
      const mockTask = { id: 1, title: "Test Task", description: "Desc", status: "incomplete" };
      pool.query.mockResolvedValue({ rows: [mockTask] });

      // Act
      const result = await taskService.createTask("Test Task", "Desc");

      // Assert
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *",
        ["Test Task", "Desc", "incomplete"]
      );
      expect(result).toEqual(mockTask);
    });

    it("should insert a task with provided status", async () => {
      const mockTask = { id: 2, title: "Done Task", description: "Desc", status: "complete" };
      pool.query.mockResolvedValue({ rows: [mockTask] });

      const result = await taskService.createTask("Done Task", "Desc", "complete");

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        ["Done Task", "Desc", "complete"]
      );
      expect(result.status).toBe("complete");
    });
  });

  describe("getRecentIncompleteTasks", () => {
    it("should fetch recent incomplete tasks", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", status: "incomplete" },
        { id: 2, title: "Task 2", status: "incomplete" },
      ];
      pool.query.mockResolvedValue({ rows: mockTasks });

      const result = await taskService.getRecentIncompleteTasks();

      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(mockTasks);
    });
  });

  describe("updateTaskStatus", () => {
    it("should update task status to complete", async () => {
      const mockTask = { id: 1, title: "Task", status: "complete" };
      pool.query.mockResolvedValue({ rows: [mockTask] });

      const result = await taskService.updateTaskStatus(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE tasks"),
        [1]
      );
      expect(result.status).toBe("complete");
    });

    it("should return undefined if no task updated", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await taskService.updateTaskStatus(999);

      expect(result).toBeUndefined();
    });
  });
});
