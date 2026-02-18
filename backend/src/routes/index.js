const express  = require("express");
const messageRoute = require("./message.route")
const authRoute = require("./auth.route")
const userRoute = require("./user.route")
const conversationRoute = require("./conversation.route")

const route = express.Router();
route.use("/message", messageRoute);
route.use("/auth", authRoute);
route.use("/user", userRoute);
route.use("/conversation", conversationRoute);

module.exports = route;