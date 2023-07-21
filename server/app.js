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
let chronometerValue = 10;

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ user, room, difficulty }) => {
    //* create user
    users.push({ id: socket.id, user, room, difficulty, chronometer: chronometerValue });
    socket.join(room);

    //display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: socket.id,
      user,
      text: `Welcome ${user}`,
      users: users?.filter((user) => user?.room === room),
      chronometer: chronometerValue,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(room).emit("message", {
      userId: socket.id,
      user,
      text: `${user} has joined the chat`,
      users: users?.filter((user) => user?.room === room),
      chronometer: chronometerValue,
    });
  });

  socket.on("startMemorizeChronometer", ({ room }) => {
    let chronometer = chronometerValue;
    let minusOneSecondInterval = setInterval(function () {
      chronometer -= 1;
      if (chronometer >= 0) {
        io.in(room).emit("minusOneSecond", chronometer);
      } else {
        clearInterval(minusOneSecondInterval);
      }
    }, 1000);
  });
});

httpServer.listen(3000);
