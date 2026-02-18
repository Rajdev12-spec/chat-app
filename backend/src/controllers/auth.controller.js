const { User } = require("../models/user.model");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");
const { generateHashPassword, verifyPassword } = require("../utils/password");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/token");

const signUp = asyncWrapper(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email already registered.", 400)
    }
    const hashedPassword = await generateHashPassword(password);

    const newUser = new User({
        firstName,
        lastName,
        password: hashedPassword,
        email
    })

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshTokens.push({ token: refreshToken });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    await newUser.save();

    res.status(201).json({
        success: true,
        message: "Welcome! Your account has been created successfully.",
        accessToken
    })

})

const signIn = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        throw new AppError("Invalid email or password", 401)
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401)
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    await user.save();
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Login successful.",
        accessToken
    })
})

const refreshToken = asyncWrapper(async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        throw new AppError("Refresh token is required");
    }

    let decoded;
    try {
        decoded = verifyRefreshToken(token)
    } catch (error) {
        throw new AppError("Invalid or expired refresh token.", 403);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new AppError("User not found.", 403);
    }

    const tokenExists = user.refreshTokens.some(
        (rt) => rt.token === token
    );

    if (!tokenExists) {
        throw new AppError("Refresh token not recognized.", 403);
    }

    user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== token
    );

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: newRefreshToken });

    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        accessToken: newAccessToken
    });
})

const signOut = asyncWrapper(async (req, res) => {

    const token = req.cookies.refreshToken;

    if (!token) {
        throw new AppError("Refresh token missing.", 400);
    }

    const user = await User.findOne({
        "refreshTokens.token": token
    });

    if (!user) {
        res.clearCookie("refreshToken");
        res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    }

    user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== token
    );

    await user.save();

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully."
    });
});

module.exports = { signUp, signIn, refreshToken, signOut }