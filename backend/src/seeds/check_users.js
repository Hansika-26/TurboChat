import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const listUsers = async () => {
    try {
        await connectDB();
        const users = await User.find({}, "fullname email");
        console.log("Found users:", users);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

listUsers();
