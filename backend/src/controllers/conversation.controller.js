const { Conversation } = require("../models/conversation.model");
const { User } = require("../models/user.model");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

const createConversation = asyncWrapper(async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        throw new AppError("Unauthorized access");
    }

    const { receiverId } = req.body;

    if (!receiverId) {
        throw new AppError("Receiver ID is required", 400)
    }

    if (receiverId === userId) {
        throw new AppError("You cannot create conversation with yourself", 400);
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [userId, receiverId] },
    });

    if (conversation) {
        return res.status(200).json({
            success: true,
            message: "Conversation already exists",
            conversation,
        });
    }

    conversation = await Conversation.create({
        participants: [userId, receiverId],
    });

    res.status(201).json({
        success: true,
        message: "Conversation created successfully",
        conversation,
    });

    const user = await User.findOne({ _id: userId });

    if (!user) {
        throw new AppError("User not found", 404);
    }
})

const getMyConversations = asyncWrapper(async (req, res) => {
    const userId = req.userId;
    const conversations = await Conversation.find({
        participants: userId,
    })
        .populate("participants", "firstName lastName email avatar isOnline")
        .populate({
            path: "lastMessage",
            select: "text sender createdAt",
            populate: {
                path: "sender",
                select: "firstName lastName",
            },
        })
        .sort({ updatedAt: -1 });

    res.status(200).json({
        success: true,
        count: conversations.length,
        conversations,
    });
});

const getConversationById = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    const conversation = await Conversation.findOne({
        _id: id,
        participants: userId
    }).populate("participants", "firstName lastName email avatar isOnline");

    if (!conversation) {
        throw new AppError("Conversation not found or not authorized", 404);
    }

    res.status(200).json({
        success: true,
        conversation,
    });
});

module.exports = { createConversation, getMyConversations, getConversationById }