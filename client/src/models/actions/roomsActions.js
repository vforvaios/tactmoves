import { createAction } from '@reduxjs/toolkit';

const setRooms = createAction('setRooms');
const setUsersInRoom = createAction('setUsersInRoom');
const setSelectedRoom = createAction('setSelectedRoom');

export { setRooms, setUsersInRoom, setSelectedRoom };
