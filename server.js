const express = require("express");
const cors = require("cors");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // your MySQL username
  password: "Varsha28!",  // your MySQL password
  database: "smart_water_iot"
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// SerialPort setup
const portName = "COM9"; // your ESP32 port
const baudRate = 115200;
const port = new SerialPort({ path: portName, baudRate: baudRate });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

let currentValue = null;

// On Arduino data received
parser.on("data", (data) => {
  data = data.trim();
  currentValue = data;

  // Console messages
  if (data.includes("NORMAL")) console.log("✅ NORMAL");
  else if (data.includes("No Hand")) console.log("No Hand → Solenoid OFF");
  else if (data.includes("Flow Rate")) console.log(data);
  else console.log("Arduino Output:", data);

  // Insert into MySQL
  const sql = "INSERT INTO arduino_logs (data) VALUES (?)";
  db.query(sql, [data], (err, result) => {
    if (err) console.error("DB Insert Error:", err);
  });
});

// API for frontend
app.get("/data", (req, res) => {
  res.json({ value: currentValue });
});

// API to fetch history
app.get("/history", (req, res) => {
  const sql = "SELECT * FROM arduino_logs ORDER BY timestamp DESC LIMIT 100";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});