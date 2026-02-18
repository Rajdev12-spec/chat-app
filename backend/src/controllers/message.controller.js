const { Conversation } = require("../models/conversation.model");
const { Message } = require("../models/message.model");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

const sendMessage = asyncWrapper(async (req, res) => {
    const { conversationId, text, image } = req.body;
    const senderId = req.userId;

    if (!conversationId) {
        throw new AppError("Conversation ID is required", 400);
    }

    if (!text && !image) {
        throw new AppError("Message content is required", 400);
    }

    // Make sure conversation exists & user belongs to it
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: senderId,
    });

    if (!conversation) {
        throw new AppError("Conversation not found or not authorized", 404);
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        text,
        image,
        seenBy: [senderId]
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const populatedMessage = await message.populate(
        "sender",
        "firstName lastName avatar"
    );

    res.status(201).json({
        success: true,
        message: populatedMessage,
    });
});

const getMessages = asyncWrapper(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.userId;

  // Check authorization
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found or not authorized", 404);
  }

  const messages = await Message.find({
    conversation: conversationId,
  })
    .populate("sender", "firstName lastName avatar")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});

const markAsSeen = asyncWrapper(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.userId;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found or not authorized", 404);
  }

  await Message.updateMany(
    {
      conversation: conversationId,
      seenBy: { $ne: userId },
    },
    {
      $push: { seenBy: userId },
    }
  );

  res.status(200).json({
    success: true,
    message: "Messages marked as seen",
  });
});

module.exports = { sendMessage, getMessages, markAsSeen }