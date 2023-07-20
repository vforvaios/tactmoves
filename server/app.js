const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const users = [];

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ user, room }) => {
    //* create user
    users.push({ id: socket.id, user, room });
    socket.join(room);

    //display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: socket.id,
      user,
      text: `Welcome ${user}`,
      users: users?.filter((user) => user?.room === room),
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(room).emit("message", {
      userId: socket.id,
      user,
      text: `${user} has joined the chat`,
      users: users?.filter((user) => user?.room === room),
    });
  });
});

httpServer.listen(3000);
