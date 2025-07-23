//REST API for my application
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({
  user: "postgres",
  host: "postgres",
  database: "mydb", //database name
  password: "password",
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());
//TABLE NAME IS TASKS.IT HAS COLUMNS [IS,TITLE,DESCRIPTION,STATUS]
//DEFAULT VALUE FOR STATUS IS INCOMPLETE

// CREATE
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const { description } = req.body;
  let { status } = req.body;

// Default to 'incomplete' if status is not provided
  if (!status) {
    status = 'incomplete';
  }

  const result = await pool.query("INSERT INTO tasks (title,description,status) VALUES ($1,$2,$3) RETURNING *", [title,description,status]);//$1 is a parameterized query to prevent sql injection
  res.json(result.rows[0]); //returns  the inserted query back as a json response
});

// READ all tasks
/*app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks");
  res.json(result.rows);
});*/

// READ only most recent 5 tasks which are incomplete
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM tasks
      WHERE status = 'incomplete'
      ORDER BY created_at DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//CHANGE STATUS FROM INCOMPLETE TO COMPLETED
// UPDATE task status from 'incomplete' to 'complete'
// PUT: Update task status to 'complete'
app.put("/tasks/:id/status", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET status = 'complete' 
       WHERE id = $1 AND status = 'incomplete' 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found or already complete" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ error: "Failed to update task status" });
  }
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});