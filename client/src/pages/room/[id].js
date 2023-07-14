import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { usersInRoom } from '@/models/selectors/roomsSelectors';

export default function Room() {
  const router = useRouter();
  const roomId = router?.query?.id;
  const allUsersInRoom = useSelector(usersInRoom);
  useEffect(() => {
    return () => {};
  }, []);

  console.log(allUsersInRoom);

  return (
    <>
      <Head>
        <title>Room page</title>
      </Head>
      <div>
        Room id: <b>{roomId}</b>
      </div>
      <div>
        Users:{' '}
        {allUsersInRoom?.map((user) => (
          <div>{user.user}</div>
        ))}
      </div>
    </>
  );
}
