import express from 'express'
import http from "http";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from './utils/dbConnect.js';
import cropRouter from './routes/crop.route.js';
import { clerkMiddleware } from "@clerk/express";
import userRouter from './routes/user.route.js';
import orderRouter from './routes/order.route.js';
import cartRouter from './routes/cart.route.js';
import chatRouter from './routes/chat.route.js';
import { initializeSocket } from './utils/socket.js';
import adminRouter from './routes/admin.route.js';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Optional: Make io accessible in routes
app.set("io", io);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(clerkMiddleware());

app.use("/api/v1/crop", cropRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/chat", chatRouter); 
app.use("/api/v1/admin", adminRouter); 

// ✅ Use server.listen() instead of app.listen()
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});