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
let chronometerValue = 10;

function createPuzzle(users, room, difficulty) {
  const gameArray = Array.from({ length: difficulty }, () =>
    new Array(difficulty).fill(''),
  );
  for (let i = 0; i < users.length; i++) {
    if (users[i].room === room) {
      users[i].gamePuzzle = gameArray;
    }
  }

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
      chronometer: chronometerValue,
    });
    socket.join(room);

    //display a welcome message to the user who have joined a room
    socket.emit('message', {
      userId: socket.id,
      user,
      text: `Welcome ${user}`,
      users: users?.filter((user) => user?.room === room),
      chronometer: chronometerValue,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(room).emit('message', {
      userId: socket.id,
      user,
      text: `${user} has joined the chat`,
      users: users?.filter((user) => user?.room === room),
      chronometer: chronometerValue,
    });
  });

  socket.on('startMemorizeChronometer', ({ room }) => {
    let chronometer = chronometerValue;
    let minusOneSecondInterval = setInterval(function () {
      chronometer -= 1;
      if (chronometer >= 0) {
        io.in(room).emit('minusOneSecond', chronometer);
      } else {
        clearInterval(minusOneSecondInterval);
      }
    }, 1000);
  });

  socket.on('startTheGame', ({ room, difficulty }) => {
    rooms.room = {
      difficulty,
      puzzle: createPuzzle(users, room, difficulty),
    };
  });

  socket.on('playerClickedSquare', ({ room, row, column }) => {
    socket.to(room).emit('usersClick', { row, column });
  });
});

httpServer.listen(3000);
