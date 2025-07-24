/*import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import axios from "axios";

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
});

test("fetches and displays tasks", async () => {
  const mockTasks = [
    { id: 1, title: "Task 1", description: "Description 1" },
  ];

  axios.get.mockResolvedValueOnce({ data: mockTasks });

  render(<App />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("Task 1")).toBeInTheDocument();
  });
});*/

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import axios from "axios";

// Mock axios globally
jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
});

test("loads and displays tasks", async () => {
  const mockTasks = [
    { id: 1, title: "Test Task", description: "This is a test task" },
  ];

  axios.get.mockResolvedValueOnce({ data: mockTasks });

  render(<App />);

  // Match full rendered text content
  await waitFor(() =>
    expect(
      screen.getByText((content, element) =>
        element.textContent === "Test Task — This is a test task"
      )
    ).toBeInTheDocument()
  );
});


test("shows message when no tasks are present", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<App />);

  await waitFor(() =>
    expect(screen.getByText(/no incomplete tasks/i)).toBeInTheDocument()
  );
});

test("shows alert when trying to add a task without title", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<App />);
  await waitFor(() => screen.getByText(/no incomplete tasks/i));

  // Mock window.alert
  window.alert = jest.fn();

  const addButton = screen.getByRole("button", { name: /add task/i });

  // Click without entering title
  fireEvent.click(addButton);
  expect(window.alert).toHaveBeenCalledWith("Title is required");
});

test("adds a new task successfully", async () => {
  axios.get.mockResolvedValueOnce({ data: [] }); // Initial fetch
  render(<App />);
  await waitFor(() =>
    expect(screen.getByText(/no incomplete tasks/i)).toBeInTheDocument()
  );

  const titleInput = screen.getByPlaceholderText(/title/i);
  const descInput = screen.getByPlaceholderText(/description/i);
  const addButton = screen.getByRole("button", { name: /add task/i });

  fireEvent.change(titleInput, { target: { value: "New Task" } });
  fireEvent.change(descInput, { target: { value: "New Description" } });

  axios.post.mockResolvedValueOnce({}); // Create call
  axios.get.mockResolvedValueOnce({
    data: [{ id: 1, title: "New Task", description: "New Description" }],
  }); // Re-fetch

  fireEvent.click(addButton);

  await waitFor(() =>
    expect(screen.getByText("New Task")).toBeInTheDocument()
  );
});

test("marks a task as done", async () => {
  const task = { id: 1, title: "Incomplete Task", description: "Needs work" };

  axios.get.mockResolvedValueOnce({ data: [task] }); // Initial fetch
  render(<App />);
  await waitFor(() =>
    expect(screen.getByText("Incomplete Task")).toBeInTheDocument()
  );

  axios.put.mockResolvedValueOnce({}); // Mark done call
  axios.get.mockResolvedValueOnce({ data: [] }); // Re-fetch

  const doneButton = screen.getByRole("button", { name: /done/i });
  fireEvent.click(doneButton);

  await waitFor(() =>
    expect(screen.getByText(/no incomplete tasks/i)).toBeInTheDocument()
  );
});

test("displays error message on fetch failure", async () => {
  axios.get.mockRejectedValueOnce(new Error("Fetch error"));

  render(<App />);

  await waitFor(() =>
    expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument()
  );
});

test("displays error message on create failure", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<App />);
  await waitFor(() =>
    expect(screen.getByText(/no incomplete tasks/i)).toBeInTheDocument()
  );

  fireEvent.change(screen.getByPlaceholderText(/title/i), {
    target: { value: "Failing Task" },
  });
  fireEvent.change(screen.getByPlaceholderText(/description/i), {
    target: { value: "Desc" },
  });

  axios.post.mockRejectedValueOnce(new Error("Create error"));

  fireEvent.click(screen.getByRole("button", { name: /add task/i }));

  await waitFor(() =>
    expect(screen.getByText(/failed to create task/i)).toBeInTheDocument()
  );
});

test("displays error message on mark done failure", async () => {
  const task = { id: 1, title: "Done Fail Task", description: "Test" };

  axios.get.mockResolvedValueOnce({ data: [task] });

  render(<App />);
  await waitFor(() =>
    expect(screen.getByText("Done Fail Task")).toBeInTheDocument()
  );

  axios.put.mockRejectedValueOnce(new Error("Update error"));

  fireEvent.click(screen.getByRole("button", { name: /done/i }));

  await waitFor(() =>
    expect(screen.getByText(/failed to update task/i)).toBeInTheDocument()
  );
});


