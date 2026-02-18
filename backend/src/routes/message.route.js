const express = require("express");
const router = express.Router();
const protect = require("../middlewares/protect");
const {sendMessage, getMessages, markAsSeen} = require("../controllers/message.controller")

router.post("/send-message", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);
router.patch("/message-seen/:conversationId", protect, markAsSeen);

module.exports = router;
