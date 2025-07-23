import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const result = await axios.get(API_URL);
      setTasks(result.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const createTask = async () => {
    if (newTask.title.trim()) {
      try {
        const result = await axios.post(API_URL, newTask);
        setTasks([...tasks, result.data]);
        setNewTask({ title: "", description: "" });
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    }
  };

  const markTaskAsDone = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: "complete" });
      fetchTasks();
    } catch (error) {
      console.error("Failed to mark task as complete:", error);
    }
  };

  return (
    <div
      className="App"
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundImage: `url("/background.jpeg")`, // path to your image
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#fff", // text color white for contrast on background
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Task Manager</h1>

      <div style={{ display: "flex", gap: "60px", marginTop: "40px" }}>
        {/* Left Column: Form */}
        <div
          style={{
            flex: 1.2,
            padding: "30px",
            borderRight: "2px solid rgba(255,255,255,0.5)",
            backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent background for readability
            borderRadius: "8px",
          }}
        >
          <h2>Add a Task</h2>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ display: "block", marginBottom: "15px", width: "100%", padding: "10px" }}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ display: "block", marginBottom: "15px", width: "100%", padding: "10px" }}
          />
          <button onClick={createTask} style={{ padding: "10px 20px", fontWeight: "bold" }}>
            Add Task
          </button>
        </div>

        {/* Right Column: Task List */}
        <div
          style={{
            flex: 2,
            padding: "30px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "8px",
            color: "#fff",
          }}
        >
          <h2>Pending Tasks</h2>
          {tasks.filter((task) => task.status !== "complete").length === 0 ? (
            <p>No pending tasks.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {tasks
                .filter((task) => task.status !== "complete")
                .map((task) => (
                  <li
                    key={task.id}
                    style={{
                      marginBottom: "20px",
                      padding: "20px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <strong>{task.title}</strong> — {task.description}
                    <span style={{ marginLeft: "10px", fontStyle: "italic", color: "#ddd" }}>
                      [{task.status}]
                    </span>
                    <div style={{ marginTop: "10px" }}>
                      <button onClick={() => markTaskAsDone(task.id)}>Done</button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
