import roomsReducer from '../reducers/roomsReducer';

const rooms = ({ roomsReducer }) => roomsReducer?.rooms;
const selectedRoom = ({ roomsReducer }) => roomsReducer?.selectedRoom;
const usersInRoom = (state) =>
  state.roomsReducer.rooms?.filter(
    (room) => room?.room === selectedRoom(state),
  );

export { rooms, usersInRoom, selectedRoom };
