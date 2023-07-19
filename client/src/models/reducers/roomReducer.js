import { createReducer } from '@reduxjs/toolkit';
import { setRoom, setNickName, setUsers } from 'models/actions/roomActions';

const initialState = {
  room: '',
  nickName: '',
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
    users: [...state.users, ...action.payload],
  }),
});

export default alertReducer;
