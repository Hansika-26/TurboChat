import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import path from "path";
dotenv.config();


const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());
app.use((req, res, next) => {
    console.log("Request Origin:", req.headers.origin);
    next();
});

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            process.env.FRONTEND_URL?.replace(/\/$/, "")
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
            callback(null, true);
        } else {
            console.error("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}
server.listen(PORT, () => {
    console.log("server is running on port " + PORT);
    console.log("Frontend URL configured as: " + process.env.FRONTEND_URL);
    connectDB();
});

