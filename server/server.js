const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load environment variables with absolute path
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Pass io to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database connection validation
if (!process.env.MONGO_URI) {
  console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // Fail fast if connection cannot be established
})
  .then(() => console.log('MongoDB connected to TaskManager DB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Crash early so it's highly visible in the server logs
  });

// Root route — visiting backend URL in browser shows server status
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Server is running',
    status: 'ok',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
    },
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected via socket.io');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Cron Jobs
const { startCronJobs } = require('./services/cronJobs');
startCronJobs();

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  module.exports = app;
} else {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
