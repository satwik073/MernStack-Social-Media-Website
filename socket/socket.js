const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  }
});

const PORT = 8000;

app.use(cors()); // Enable CORS for all routes

// Store connected users
const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log('A user connected');

  // Add user to the set of connected users
  connectedUsers.add(socket.id);

  // Emit updated list of connected users to all clients
  io.emit('connectedUsers', Array.from(connectedUsers));

  socket.on('chat message', (message) => {
    console.log('Message:', message);
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');

    // Remove user from the set of connected users
    connectedUsers.delete(socket.id);

    // Emit updated list of connected users to all clients
    io.emit('connectedUsers', Array.from(connectedUsers));
  });
});

server.listen(PORT, () => {
  console.log(`Socket running on port ${PORT}`);
});
