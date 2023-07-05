import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button } from '@mui/material';
import notifications from '@/utils/notifications';

import io from 'socket.io-client';
let socket;

export default function Home() {
  const [notificationClicked, setNotificationClicked] = useState(false);

  const sendNotification = (data) => {
    if (Notification.permission === 'granted') {
      notifications(data);
    } else {
      Notification.requestPermission(function (status) {
        if (status === 'granted') {
          notifications(data);
        } else {
          alert('No permissions granted for push notifications');
        }
      });
    }
  };

  const socketInitializer = () => {
    socket = io('http://192.168.1.5:3000');

    socket.on('youareconnected', (data) => {
      // localStorage.removeItem('userId');
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', data?.userId);
        socket.emit('addme', { userId: localStorage.getItem('userId') });
      }
    });

    socket.on('sendNotification', (data) => {
      sendNotification(data);
    });
  };

  useEffect(() => {
    Notification.requestPermission();
    socketInitializer();
  }, []);

  useEffect(() => {
    if (notificationClicked) {
      socket?.emit('message', 'this is a test');
      setNotificationClicked(false);
    }
  }, [notificationClicked]);

  return (
    <>
      <Head>
        <title>Home page</title>
      </Head>
      <Button
        onClick={() => setNotificationClicked(true)}
        sx={{ textTransform: 'none' }}>
        Create Push Notification
      </Button>
    </>
  );
}
