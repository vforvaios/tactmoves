import { createReducer } from '@reduxjs/toolkit';
import {
  setRoom,
  setNickName,
  setUsers,
  setDifficulty,
} from 'models/actions/roomActions';

const initialState = {
  room: '',
  nickName: '',
  difficulty: undefined,
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
});

export default alertReducer;
