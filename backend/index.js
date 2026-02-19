const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const mainRoute = require("./src/routes/index");
const connectDb = require("./src/config/db");
const cookieParser = require("cookie-parser");

connectDb();

const app = express();
const server = http.createServer(app);

// ✅ Create socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log("Joined room:", conversationId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/v1/api", mainRoute);

app.get("/", (req, res) => {
  return res.send({
    status: "ok",
    message: "Server is working fine",
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

server.listen(5000, () => {
  console.log(`Server is running: http://localhost:5000`);
});
