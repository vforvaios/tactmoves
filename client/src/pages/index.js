import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setRooms,
  setUsersInRoom,
  setSelectedRoom,
} from '@/models/actions/roomsActions';
import { rooms } from '@/models/selectors/roomsSelectors';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import socket from '../config';

export default function Home() {
  const dispatch = useDispatch();
  const allRooms = useSelector(rooms);
  const router = useRouter();

  const socketInitializer = () => {
    socket.on('youareconnected', (data) => {
      if (!sessionStorage.getItem('userId')) {
        sessionStorage.setItem('userId', data?.userId);
        socket.emit('addme', { userId: sessionStorage.getItem('userId') });
      }
    });
  };

  const createRoom = () => {
    socket.emit('createRoom', sessionStorage?.getItem('userId'));
  };

  useEffect(() => {
    socketInitializer();
    socket.on('youareconnected', (payload) => {
      dispatch(setRooms(payload?.rooms));
    });

    socket.on('roomsUpdated', (payload) => {
      dispatch(setRooms(payload?.rooms));
    });

    socket.on('goToRoom', (payload) => {
      dispatch(setSelectedRoom({ room: payload.room }));
      dispatch(setUsersInRoom({ room: payload.room, user: payload?.userId }));
      router.push(`/room/${payload?.room}`);
    });
  }, []);

  const joinExistingRoom = (room) => {
    socket.emit('joinExistingRoom', {
      userId: sessionStorage?.getItem('userId'),
      room,
    });
  };

  return (
    <>
      <Head>
        <title>Home page</title>
      </Head>
      <div>This is the tactmove game!</div>
      <div>
        <FormControl fullWidth>
          <InputLabel id="roomsIds">Age</InputLabel>
          <Select
            labelId="roomsIds"
            id="demo-simple-select"
            value=""
            label="Age"
            onChange={() => {}}>
            {allRooms?.map((room, index) => (
              <MenuItem
                onClick={() => joinExistingRoom(room?.room)}
                key={index}
                value={room?.room}>
                {room?.room}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl fullWidth>
          <Button onClick={createRoom}>Create room</Button>
        </FormControl>
      </div>
    </>
  );
}
