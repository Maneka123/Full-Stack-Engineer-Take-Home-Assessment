import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import "./App.css";

const TaskForm = lazy(() => import("./TaskForm"));
const TaskList = lazy(() => import("./TaskList"));

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
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const createTask = async () => {
    if (newTask.title.trim()) {
      try {
        const result = await axios.post(API_URL, newTask);
        setTasks([...tasks, result.data]);
        setNewTask({ title: "", description: "" });
      } catch (err) {
        console.error("Failed to create task:", err);
      }
    }
  };

  const markTaskAsDone = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: "complete" });
      fetchTasks(); // refresh tasks to hide completed
    } catch (err) {
      console.error("Failed to mark task as done:", err);
    }
  };

  return (
    <div className="container">
      <Suspense fallback={<div>Loading Form...</div>}>
        <TaskForm newTask={newTask} setNewTask={setNewTask} createTask={createTask} />
      </Suspense>

      <Suspense fallback={<div>Loading Tasks...</div>}>
        <TaskList tasks={tasks} markTaskAsDone={markTaskAsDone} />
      </Suspense>
    </div>
  );
}

export default App;
