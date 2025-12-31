import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        // Fetch the last message for each user
        const usersWithLastMessage = await Promise.all(
            filteredUsers.map(async (user) => {
                const lastMessage = await Message.findOne({
                    $or: [
                        { senderId: loggedInUserId, receiverId: user._id },
                        { senderId: user._id, receiverId: loggedInUserId },
                    ],
                })
                    .sort({ createdAt: -1 }) // Sort by new to old
                    .limit(1);

                const unreadCount = await Message.countDocuments({
                    senderId: user._id,
                    receiverId: loggedInUserId,
                    read: false,
                });

                return {
                    ...user.toObject(),
                    lastMessage: lastMessage
                        ? {
                            text: lastMessage.text,
                            image: lastMessage.image,
                            senderId: lastMessage.senderId,
                            createdAt: lastMessage.createdAt,
                        }
                        : null,
                    unreadCount,
                };
            })
        );

        res.status(200).json(usersWithLastMessage);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        // Mark messages as read
        await Message.updateMany(
            { senderId: userToChatId, receiverId: myId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal Server Error" });


    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            // Upload base64 image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();


        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage.toObject());
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal Server Error" });

    }
}