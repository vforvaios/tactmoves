const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const users = [];
const rooms = {};
const games = {};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createPuzzle(users, room, difficulty) {
  const gameArray = Array.from({ length: difficulty }, () =>
    new Array(difficulty).fill(),
  );

  const gameArrayResolved = Array.from({ length: difficulty }, () =>
    new Array(difficulty).fill(),
  );

  for (let i = 0; i < users.length; i++) {
    if (users[i].room === room) {
      users[i].gamePuzzle = gameArray;
    }
  }
  // console.log('users=', users);
  const usersInRoom = users
    ?.filter((user) => user.room === room)
    ?.map((us) => us?.user);

  if (!games?.[room]) {
    games[room] = gameArrayResolved?.map((row) =>
      row?.map((cell) => random(usersInRoom)),
    );
  }

  console.log(games[room]);

  io.in(room).emit('getPuzzle', { gameArray });
}

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ user, room, difficulty }) => {
    //* create user
    users.push({
      id: socket.id,
      user,
      room,
      difficulty,
    });
    socket.join(room);

    //display a welcome message to the user who have joined a room
    socket.emit('message', {
      userId: socket.id,
      user,
      text: `Welcome ${user}`,
      users: users?.filter((user) => user?.room === room),
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(room).emit('message', {
      userId: socket.id,
      user,
      text: `${user} has joined the chat`,
      users: users?.filter((user) => user?.room === room),
    });
  });

  socket.on('startTheGame', ({ room, difficulty }) => {
    rooms.room = {
      difficulty,
      puzzle: createPuzzle(users, room, difficulty),
    };
  });

  socket.on('playerClickedSquare', ({ room, row, column, user }) => {
    socket.to(room).emit('usersClick', { row, column });
  });
});

httpServer.listen(3000);
