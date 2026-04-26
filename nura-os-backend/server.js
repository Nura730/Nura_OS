import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "nura_os_super_secret_key_2026";

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, "nura.db"), (err) => {
  if (err) console.error("Error opening database", err);
  else {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS user_data (
        userId INTEGER PRIMARY KEY,
        payload TEXT,
        lastSynced DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);
  }
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

// --- ROUTES ---

// 1. Register
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      function (err) {
        if (err) return res.status(400).json({ error: "Email already exists" });
        const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: "30d" });
        res.json({ token, user: { id: this.lastID, name, email } });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// 3. Sync Data (Save)
app.post("/data/sync", authenticate, (req, res) => {
  const payload = JSON.stringify(req.body);
  
  db.run(
    `INSERT INTO user_data (userId, payload, lastSynced) VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(userId) DO UPDATE SET payload = excluded.payload, lastSynced = CURRENT_TIMESTAMP`,
    [req.userId, payload],
    (err) => {
      if (err) return res.status(500).json({ error: "Failed to save data" });
      res.json({ success: true, message: "Data synced successfully" });
    }
  );
});

// 4. Get Data (Load)
app.get("/data/sync", authenticate, (req, res) => {
  db.get("SELECT payload FROM user_data WHERE userId = ?", [req.userId], (err, row) => {
    if (err) return res.status(500).json({ error: "Failed to load data" });
    if (!row) return res.json({ payload: null });
    
    res.json({ payload: JSON.parse(row.payload) });
  });
});

app.get("/", (req, res) => res.send("Nura OS SQLite Backend Running"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});