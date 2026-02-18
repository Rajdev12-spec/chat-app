const express = require("express");
const { createConversation, getMyConversations, getConversationById } = require("../controllers/conversation.controller");
const protect = require("../middlewares/protect");
const route = express.Router();

route.post('/create', protect, createConversation)
route.post('/my-conversation', protect, getMyConversations)
route.post('/:id', protect, getConversationById)

module.exports = route
