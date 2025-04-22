// db.js
const mongoose = require('mongoose');

const URI = "mongodb://127.0.0.1:27017/v-guard";

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('✅ Database is connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1); // optional: stop the server if DB connection fails
    }
};

module.exports = connectDB;
