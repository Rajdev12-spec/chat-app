const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");
const { User } = require("../models/user.model");

const protect = asyncWrapper(async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Access token is required.", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired access token.", 401);
  }

  const user = await User.findById(decoded.id).select("-password -refreshTokens");

  if (!user) {
    throw new AppError("User not found.", 401);
  }

  req.userId = user._id;

  next();
});

module.exports = protect;
