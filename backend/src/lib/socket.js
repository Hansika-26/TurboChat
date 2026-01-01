import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:3000",
                "https://turbo-chat2.vercel.app",
                process.env.FRONTEND_URL?.replace(/\/$/, "")
            ].filter(Boolean);

            if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by Socket CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST"]
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//use to store online users 
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    //io.emit() is used to send events to all connected clients 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

export { io, app, server };

