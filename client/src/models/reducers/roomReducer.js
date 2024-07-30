import { createReducer } from '@reduxjs/toolkit';
import {
  setRoom,
  setNickName,
  setUsers,
  setDifficulty,
  setGamePuzzle,
  setRowColumnColor,
} from 'models/actions/roomActions';

const initialState = {
  room: '',
  nickName: '',
  gamePuzzle: undefined,
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
  [setGamePuzzle.type]: (state, action) => ({
    ...state,
    gamePuzzle: action.payload,
  }),
  [setRowColumnColor.type]: (state, action) => ({
    ...state,
    gamePuzzle: state?.gamePuzzle?.map((row, index) =>
      index !== action.payload.row
        ? [...row]
        : row?.map((col, index2) =>
            index2 !== action.payload.column ? col : 'red',
          ),
    ),
  }),
});

export default alertReducer;
