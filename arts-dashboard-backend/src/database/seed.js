const db = require("./db");

db.serialize(() => {
  // Clear existing data
  db.run("DELETE FROM events");
  db.run("DELETE FROM teams");
  db.run("DELETE FROM participants");
  db.run("DELETE FROM scores");

  // Teams
  const teams = [
    ["Phoenix Raiders", "#ef4444", "PHX", "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=100&h=100&fit=crop"],
    ["Storm Chasers", "#3b82f6", "STM", "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=100&h=100&fit=crop"],
    ["Shadow Ninjas", "#111827", "SHD", "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=100&h=100&fit=crop"]
  ];

  const teamStmt = db.prepare("INSERT INTO teams (name, color, code, logo_url) VALUES (?, ?, ?, ?)");
  teams.forEach(t => teamStmt.run(t));
  teamStmt.finalize();

  // Events
  const events = [
    ["Classical Dance", "Stage", 50, 3, JSON.stringify(["Judge A", "Judge B", "Judge C"]), 1, "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80"],
    ["Light Music", "Stage", 30, 2, JSON.stringify(["Judge X", "Judge Y"]), 2, "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"],
    ["Oil Painting", "Non-Stage", 100, 1, JSON.stringify(["Expert Z"]), 3, "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80"]
  ];

  const eventStmt = db.prepare("INSERT INTO events (name, category, max_marks, judge_count, judge_names, event_order, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
  events.forEach(e => eventStmt.run(e));
  eventStmt.finalize();

  console.log("Database seeded with test data");
});
