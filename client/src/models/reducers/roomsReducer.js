import { createReducer } from '@reduxjs/toolkit';
import {
  setRooms,
  setUsersInRoom,
  setSelectedRoom,
} from '@/models/actions/roomsActions';

const initialState = {
  rooms: [],
  users: {},
  selectedRoom: '',
};

const roomsReducer = createReducer(initialState, {
  [setRooms.type]: (state, action) => ({
    ...state,
    rooms: action.payload,
  }),
  [setSelectedRoom.type]: (state, action) => ({
    ...state,
    selectedRoom: action.payload?.room,
  }),
  [setUsersInRoom.type]: (state, action) => ({
    ...state,
    users: {
      ...state?.users,
      [action.payload.room]: [action.payload.user],
    },
  }),
});

export default roomsReducer;
