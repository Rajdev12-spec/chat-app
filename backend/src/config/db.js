const mongoose = require("mongoose");
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chat-app")
        console.log("Mongodb connected")
    } catch (error) {
        console.error(`Error occured while connecting the mongodb`)
        process.exit(1)
    }
}
module.exports = connectDb