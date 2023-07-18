import { nickName, room } from 'models/selectors/roomSelectors';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Game = ({ socket }) => {
  const myNickName = useSelector(nickName);
  const myRoomName = useSelector(room);

  useEffect(() => {
    socket.broadcoast
      .to(myRoomName)
      .emit('canijoin', { user: myNickName, room: myRoomName });
  }, []);

  return (
    <div className="chat">
      <div className="user-name">
        <h2>
          {myNickName}{' '}
          <span style={{ fontSize: '0.7rem' }}>in {myRoomName}</span>
        </h2>
      </div>
    </div>
  );
};

export default Game;
