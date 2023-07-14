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

  socket.on("createRoom", (payload) => {
    const room = crypto.randomUUID();
    socket.join(room);
    rooms.push({ user: payload, room });
    io.emit("roomsUpdated", { rooms, room });
    io.to(socket.id).emit("goToRoom", { room, userId });
    console.log(rooms);
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

  // JOIN AN EXISTING ROOM
  socket.on("joinExistingRoom", (payload) => {
    rooms.push({ user: payload?.userId, room: payload?.room });
    io.emit("roomsUpdated", { rooms, room: payload?.room });
    io.to(socket.id).emit("goToRoom", { room: payload?.room, userId });
    console.log(rooms);
  });
});

httpServer.listen(3000);
