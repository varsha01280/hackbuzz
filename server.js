const express = require("express");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection setup (update with your password)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Ensure this is correct
  database: "smart_water_iot"
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL Workbench!");

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;
  db.query(createUsersTable, (err) => {
    if (err) console.error("Error creating users table:", err);
  });
});

// SerialPort Setup for Arduino
const portName = "COM9"; // CHANGE THIS to your Arduino Port!
const baudRate = 115200;
let port, parser;

try {
  port = new SerialPort({ path: portName, baudRate: baudRate });
  parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  port.on('error', err => console.error('Serial port error: ', err.message));
} catch (error) {
  console.error("Failed to initialize SerialPort:", error.message);
}

let currentValue = null;

// Reading Arduino Data from Serial
if (parser) {
  parser.on("data", (data) => {
    data = data.trim();
    currentValue = data;

    // Terminal Logging based on Arduino Code
    if (data.includes("NORMAL")) console.log("✅ NORMAL (No Leak)");
    else if (data.includes("LEAKAGE")) console.log("⚠️ LEAKAGE DETECTED!");
    else if (data.includes("No Hand")) console.log("🚫 No Hand Detected → Solenoid OFF");
    else if (data.includes("Hand Detected")) console.log("✋ Hand Detected → Solenoid ON");
    else if (data.includes("Flow Rate")) console.log("💧 " + data);

    // Insert data history into MySQL
    const sql = "INSERT INTO arduino_logs (data) VALUES (?)";
    db.query(sql, [data], (err) => {
      if (err) console.error("DB Insert Error:", err);
    });
  });
}

// API to serve live data to the Frontend
app.get("/data", (req, res) => {
  res.json({ value: currentValue });
});

// API to serve history
app.get("/history", (req, res) => {
  const sql = "SELECT * FROM arduino_logs ORDER BY timestamp DESC LIMIT 100";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// API to clear history
app.delete("/history", (req, res) => {
  const sql = "TRUNCATE TABLE arduino_logs";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ success: true, message: "Logs cleared" });
  });
});

// API for Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  const checkSql = "SELECT * FROM users WHERE username = ?";
  db.query(checkSql, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length > 0) return res.status(400).json({ message: "User already exists" });

    const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(insertSql, [username, password], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "User created" });
    });
  });
});

// API for Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

