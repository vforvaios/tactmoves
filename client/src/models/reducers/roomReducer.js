import { createReducer } from '@reduxjs/toolkit';
import {
  setRoom,
  setNickName,
  setUsers,
  setDifficulty,
  setGamePuzzle,
  setRowColumnColor,
  setRowColumnUser,
  setGameStatusAvailable,
} from 'models/actions/roomActions';

const initialState = {
  room: '',
  nickName: '',
  gamePuzzle: undefined,
  users: [],
  gamePuzzleAttributes: undefined,
  gameStatusAvailable: false,
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
    gamePuzzleAttributes: action.payload,
  }),
  [setGameStatusAvailable.type]: (state, action) => ({
    ...state,
    gameStatusAvailable: action.payload,
  }),
  [setRowColumnColor.type]: (state, action) => ({
    ...state,
    gamePuzzle: state?.gamePuzzle?.map((row, index) =>
      index !== action.payload.row
        ? [...row]
        : row?.map((col, index2) =>
            index2 !== action.payload.column
              ? col
              : action?.payload?.user === state.nickName
              ? 'red'
              : 'yellow',
          ),
    ),
  }),
  [setRowColumnUser.type]: (state, action) => ({
    ...state,
    gamePuzzleAttributes: state?.gamePuzzleAttributes?.map((row, index) =>
      index !== action.payload.row
        ? [...row]
        : row?.map((col, index2) =>
            index2 !== action.payload.column ? col : action?.payload?.user,
          ),
    ),
  }),
});

export default alertReducer;
