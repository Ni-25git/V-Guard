// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db');
const safetyDashboard = require('./routes/safetyDashboardRouter');
const production = require('./routes/productionRouter');
const cors = require('cors');
const dotenv = require('dotenv').config()

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

// Attach io instance to app for use in routes
app.set('io', io);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/', safetyDashboard);
app.use('/production', production);

app.get('/', (req, res) => {
    res.send('Welcome to V-Guard project');
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('🟢 A client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔴 A client disconnected:', socket.id);
    });
});

// Start server after DB connection
const PORT = process.env.PORT;
server.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('❌ Error connecting to DB:', error.message);
    }
});
