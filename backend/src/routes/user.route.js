const express = require("express");
const protect = require("../middlewares/protect");
const {getProfile, getAllUsers} = require("../controllers/user.controller")
const route = express.Router();

route.get("/me", protect, getProfile);
route.get("/all-users", protect, getAllUsers);

module.exports = route