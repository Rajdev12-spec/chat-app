const { User } = require("../models/user.model");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

const getProfile = asyncWrapper(async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        throw new AppError("Unauthorized user", 401);
    }

    const user = await User.findOne({ _id: userId }).select("-password -refreshTokens");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    res.status(200).json({
        success: false,
        message: "user profile data",
        data: user
    })
})

const getAllUsers = asyncWrapper(async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        throw new AppError("Unauthorized access", 401);
    }

    // Optional: pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ _id: { $ne: userId } }) // exclude current user
        .select("-password -__v -refreshTokens") // never send sensitive fields
        .skip(skip)
        .limit(limit)
        .lean();

    const totalUsers = await User.countDocuments({ _id: { $ne: userId } });

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        pagination: {
            total: totalUsers,
            page,
            limit,
            totalPages: Math.ceil(totalUsers / limit),
        },
        data: users,
    });
});

module.exports = { getProfile, getAllUsers }