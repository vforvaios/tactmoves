import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRooms } from '@/models/actions/roomsActions';
import { rooms } from '@/models/selectors/roomsSelectors';
import Head from 'next/head';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

import io from 'socket.io-client';
let socket;

export default function Home() {
  const dispatch = useDispatch();
  const allRooms = useSelector(rooms);

  const socketInitializer = () => {
    socket = io('http://localhost:3000');

    socket.on('youareconnected', (data) => {
      // localStorage.removeItem('userId');
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', data?.userId);
        socket.emit('addme', { userId: localStorage.getItem('userId') });
      }
    });
  };

  const createRoom = () => {
    socket.emit('createRoom', 'Room');
  };

  useEffect(() => {
    socketInitializer();
    socket.on('youareconnected', (payload) => {
      dispatch(setRooms(payload?.rooms));
    });

    socket.on('roomsUpdated', (payload) => {
      console.log(payload);
      dispatch(setRooms(payload));
    });
  }, []);

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
              <MenuItem key={index} value={room}>
                {room}
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
