const express = require("express");
const validate = require("../middlewares/validate.middleware");
const { signUpSchema, signInSchema } = require("../validations/auth.schema");
const { signUp, signIn, refreshToken, signOut } = require("../controllers/auth.controller");
const protect = require("../middlewares/protect");

const route = express.Router();
route.post("/sign-up", validate(signUpSchema), signUp);
route.post("/sign-in", validate(signInSchema), signIn);
route.get("/refresh-token", refreshToken);
route.post("/sign-out", protect, signOut);

module.exports = route