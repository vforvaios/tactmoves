import { createAction } from '@reduxjs/toolkit';

const setRoom = createAction('alert/setRoom');
const setNickName = createAction('alert/setNickName');
const setUsers = createAction('alert/setUsers');
const manipulateUsers = createAction('alert/manipulateUsers');

export { setRoom, setNickName, setUsers, manipulateUsers };
