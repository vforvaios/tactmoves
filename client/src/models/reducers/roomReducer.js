import { createReducer } from '@reduxjs/toolkit';
import { setRoom, setNickName } from 'models/actions/roomActions';

const initialState = {
  room: '',
  nickName: '',
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
});

export default alertReducer;
