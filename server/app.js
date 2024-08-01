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

function checkGameEnd({ currentPuzzleStatus, correctPuzzle }) {
  if (currentPuzzleStatus === correctPuzzle) return true;
  if (currentPuzzleStatus == null || correctPuzzle == null) return false;
  if (currentPuzzleStatus.length !== correctPuzzle.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < currentPuzzleStatus.length; ++i) {
    if (currentPuzzleStatus[i] !== correctPuzzle[i]) return false;
  }
  return true;
}
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createPuzzle(users, room, difficulty) {
  const gameArray = [];
  const gameArrayResolved = [];
  for (let i = 0; i < difficulty; i++) {
    gameArray[i] = [];
    gameArrayResolved[i] = [];
    for (j = 0; j < difficulty; j++) {
      gameArray[i][j] = '';
      gameArrayResolved[i][j] = '';
    }
  }

  for (let i = 0; i < users.length; i++) {
    if (users[i].room === room) {
      users[i].gamePuzzle = gameArray;
    }
  }

  const usersInRoom = users
    ?.filter((user) => user.room === room)
    ?.map((us) => us?.user);

  if (!games?.[room]) {
    games[room] = gameArrayResolved?.map((row) =>
      row?.map((cell) => random(usersInRoom)),
    );
  }

  io.in(room).emit('getPuzzle', { gameArray, resolvedGame: games[room] });
}

io.on('connection', (socket) => {
  console.log('INITIAL USERS=', users);
  socket.emit('numberOfUsers', { users });
  socket.on('disconnecting', (reason) => {
    const allRoomsForTheDisconnectingUser = [...socket.rooms];
    allRoomsForTheDisconnectingUser.forEach((room) => {
      socket.leave(room);
      const userLeftNickName = users?.find((user) => user.id === socket.id)
        ?.user;
      userLeft = users.filter((user) => user.id !== socket.id);
      socket.to(room).emit('userLeft', { userLeft });
    });
  });
  socket.on('joinRoom', ({ user, room, difficulty }) => {
    //* create user
    users.push({
      id: socket.id,
      user,
      room,
      difficulty,
    });
    socket.join(room);
    console.log('USERS AFTER JOINING=', users);

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
    socket.to(room).emit('usersClick', { row, column, user });
  });

  socket.on('checkGameEnd', ({ room, currentPuzzleStatus }) => {
    const puzzleIsSolved = checkGameEnd({
      currentPuzzleStatus,
      correctPuzzle: games[room],
    });
    io.in(room).emit('puzzleSolutionCheck', { solved: puzzleIsSolved });
  });
});

httpServer.listen(3000);
