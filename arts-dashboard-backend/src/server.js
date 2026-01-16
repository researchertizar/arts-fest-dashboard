require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.set("io", io);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const testRoutes = require("./routes/test.routes");
app.use("/api/test", testRoutes);

const eventRoutes = require("./routes/event.routes");
app.use("/api/events", eventRoutes);

const teamRoutes = require("./routes/team.routes");
app.use("/api/teams", teamRoutes);

const participantRoutes = require("./routes/participant.routes");
app.use("/api/participants", participantRoutes);

const scoreRoutes = require("./routes/score.routes");
app.use("/api/scores", scoreRoutes);

const scoreboardRoutes = require("./routes/scoreboard.routes");
app.use("/api/scoreboard", scoreboardRoutes);

const announcementRoutes = require("./routes/announcement.routes");
app.use("/api/announcements", announcementRoutes);

const debugRoutes = require("./routes/debug.routes");
app.use("/api/debug", debugRoutes);

const db = require("./database/db");
require("./database/init");

app.get("/", (req, res) => {
  res.send("Arts Fest Backend Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
