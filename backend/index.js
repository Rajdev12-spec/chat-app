const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const mainRoute = require("./src/routes/index");
const connectDb = require("./src/config/db");
const cookieParser = require("cookie-parser");
connectDb()

const app = express();
const server = http.createServer(app, {
    cors: {
        origin: "http://localhost:5173"
    }
});

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}));

app.use(cookieParser());
app.use("/v1/api", mainRoute)
app.get("/", (req, res) => {
    return res.send({
        status: "ok",
        message: "Server is working fine"
    })
})

// This line should last of the all routes
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message
    })
})

server.listen(5000, () => {
    console.log(`Server is running: http://localhost:5000`)
})