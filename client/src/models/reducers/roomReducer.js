import { createReducer } from '@reduxjs/toolkit';
import {
  setRoom,
  setNickName,
  setUsers,
  setDifficulty,
  setChronometer,
  setGameStarted,
} from 'models/actions/roomActions';

const initialState = {
  room: '',
  nickName: '',
  difficulty: undefined,
  chronometer: undefined,
  gameStared: false,
  users: [],
};
const alertReducer = createReducer(initialState, {
  [setRoom.type]: (state, action) => ({
    ...state,
    room: action.payload,
  }),
  [setNickName.type]: (state, action) => ({
    ...state,
    nickName: action.payload,
  }),
  [setUsers.type]: (state, action) => ({
    ...state,
    users: [...action.payload],
  }),
  [setDifficulty.type]: (state, action) => ({
    ...state,
    difficulty: action.payload,
  }),
  [setChronometer.type]: (state, action) => ({
    ...state,
    chronometer: action.payload,
  }),
  [setGameStarted.type]: (state, action) => ({
    ...state,
    gameStared: !state?.gameStared,
  }),
});

export default alertReducer;
