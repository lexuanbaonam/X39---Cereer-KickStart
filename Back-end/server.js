import express from "express";
// import http from 'http';
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import rootRouter from "./routes/index.js";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import { connectDB } from "./services/db.connect.js";

// import socketController from './controllers/Socket.Controllers.js';

// Connect to MongoDB
connectDB();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const server = http.createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Các phương thức HTTP được phép
  allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
  accessControlAllowCredentials: true, // Cho phép cookie và thông tin xác thực
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// const io = new Server(server, {
//   cors: corsOptions,
//   pingTimeout: 60000,
//   pingInterval: 25000,
//   transports: ['websocket', 'polling']
// });

// app.set('io', io);

// socketController(io);

// Routes
app.use("/api", rootRouter);
app.get("/api", (req, res) => {
  res.json({
    message: "API is working",
    timestamp: new Date(),
  });
});

// app.get('/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date(),
//     environment: process.env.NODE_ENV || 'development',
//     socket: {
//       connected: io.engine.clientsCount,
//       rooms: io.sockets.adapter.rooms.size
//     }
//   });
// });

// app.use('*', (req, res) => {
//   res.status(404).json({
//     message: 'Route not found',
//     path: req.originalUrl
//   });
// });
