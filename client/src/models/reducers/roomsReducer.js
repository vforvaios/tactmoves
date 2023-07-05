import { createReducer } from '@reduxjs/toolkit';
import { setRooms } from '@/models/actions/roomsActions';

const initialState = {
  rooms: [],
};
const roomsReducer = createReducer(initialState, {
  [setRooms.type]: (state, action) => ({
    ...state,
    rooms: action.payload,
  }),
});

export default roomsReducer;
