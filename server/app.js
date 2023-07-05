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

io.on("connection", (socket) => {
  console.log(users);
  const userId = crypto.randomUUID();
  socket.emit("youareconnected", { userId });

  socket.on("message", (data) => {
    socket.broadcast.emit("sendNotification", data);
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
