const db = require("./db");

db.serialize(() => {
  // EVENTS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      max_marks INTEGER NOT NULL,
      judge_count INTEGER NOT NULL,
      judge_names TEXT NOT NULL,
      event_order INTEGER NOT NULL,
      is_active INTEGER DEFAULT 0,
      is_locked INTEGER DEFAULT 0,
      image_url TEXT,
      video_url TEXT
    )
  `);

  // TEAMS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      code TEXT NOT NULL,
      logo_url TEXT
    )
  `);

  // PARTICIPANTS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      team_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      order_no INTEGER NOT NULL,
      image_url TEXT,
      video_url TEXT
    )
  `);

  // SCORES TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      participant_id INTEGER NOT NULL,
      judge_index INTEGER NOT NULL,
      marks INTEGER NOT NULL,
      locked INTEGER DEFAULT 0,
      UNIQUE(event_id, participant_id, judge_index)
    )
  `);

  // ANNOUNCEMENTS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      active INTEGER DEFAULT 1
    )
  `);

  console.log("Database tables initialized");
});
