const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "artsfest.db");

const db = new sqlite3.Database(
  "src/database/artsfest.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error("DB connection error:", err.message);
    } else {
      console.log("SQLite connected");
    }
  }
);

// VERY IMPORTANT — ADD THIS
db.serialize(() => {
  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA synchronous = NORMAL");
});

module.exports = db;

