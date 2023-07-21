import { createAction } from '@reduxjs/toolkit';

const setRoom = createAction('alert/setRoom');
const setNickName = createAction('alert/setNickName');
const setUsers = createAction('alert/setUsers');
const manipulateUsers = createAction('alert/manipulateUsers');
const setDifficulty = createAction('alert/setDifficulty');
const setChronometer = createAction('alert/setChronometer');
const setGameStarted = createAction('alert/setGameStarted');

export {
  setRoom,
  setNickName,
  setUsers,
  manipulateUsers,
  setDifficulty,
  setChronometer,
  setGameStarted,
};
