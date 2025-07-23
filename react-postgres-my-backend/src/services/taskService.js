const pool = require("../db/pool");

const createTask = async (title, description, status = "incomplete") => {
  const result = await pool.query(
    "INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *",
    [title, description, status]
  );
  return result.rows[0];
};

const getRecentIncompleteTasks = async () => {
  const result = await pool.query(`
    SELECT * FROM tasks
    WHERE status = 'incomplete'
    ORDER BY created_at DESC
    LIMIT 5
  `);
  return result.rows;
};

const updateTaskStatus = async (id) => {
  const result = await pool.query(
    `UPDATE tasks 
     SET status = 'complete' 
     WHERE id = $1 AND status = 'incomplete' 
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createTask,
  getRecentIncompleteTasks,
  updateTaskStatus,
};
