const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "companydb",
  waitForConnections: true,
  connectionLimit: 10
};

const pool = mysql.createPool(dbConfig);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "UP", database: "CONNECTED" });
  } catch (err) {
    res.status(503).json({
      status: "DOWN",
      database: "UNAVAILABLE"
    });
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, role FROM employees ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error("Employee query failed:", err.message);
    res.status(500).json({ error: "Unable to retrieve employees" });
  }
});

const port = 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on port ${port}`);
});
