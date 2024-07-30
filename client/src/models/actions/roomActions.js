import { createAction } from '@reduxjs/toolkit';

const setRoom = createAction('alert/setRoom');
const setNickName = createAction('alert/setNickName');
const setUsers = createAction('alert/setUsers');
const manipulateUsers = createAction('alert/manipulateUsers');
const setDifficulty = createAction('alert/setDifficulty');
const setGamePuzzle = createAction('alert/setGamePuzzle');
const setRowColumnColor = createAction('alert/setRowColumnColor');
const setRowColumnUser = createAction('alert/setRowColumnUser');
const setGameStatusAvailable = createAction('alert/setGameStatusAvailable');

export {
  setRoom,
  setNickName,
  setUsers,
  manipulateUsers,
  setDifficulty,
  setGamePuzzle,
  setRowColumnColor,
  setRowColumnUser,
  setGameStatusAvailable,
};
