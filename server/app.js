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

let users = [];
const playerColors = ["green", "red", "yellow", "brown", "black", "lavender", "purple", "orange", "teal"];
let rooms = [];

io.on("connection", (socket) => {
  console.log(users);

  const userId = crypto.randomUUID();
  socket.emit("youareconnected", { userId, rooms });

  socket.on("createRoom", (room) => {
    socket.join(room);
    rooms.push(room);
    console.log(rooms);
    socket.broadcast.emit("roomsUpdated", rooms);
  });

  socket.on("addme", (data) => {
    if (!users?.find((user) => user?.userId === data?.userId)) {
      users.push({ userId: data?.userId });
      console.log(users);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("disconnected user, ", reason);
  });
});

httpServer.listen(3000);
