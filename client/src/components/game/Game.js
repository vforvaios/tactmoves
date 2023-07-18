import { setNickName } from 'models/actions/roomActions';
import { nickName } from 'models/selectors/roomSelectors';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Game = ({ socket }) => {
  const dispatch = useDispatch();
  const myNickName = useSelector(nickName);
  const myRoomName = useParams()?.room;
  const [haveSetNickName, setHaveSetNickName] = useState(myNickName);
  const params = useParams();

  const sendData = () => {
    socket.emit('joinRoom', { user: myNickName, room: params.room });
    setHaveSetNickName(true);
  };

  return (
    <div className="chat">
      {!haveSetNickName ? (
        <>
          <div>
            <input
              placeholder="Input your user name"
              value={myNickName}
              onChange={(e) => dispatch(setNickName(e.target.value))}
            />
          </div>
          <div>
            <button className="next" onClick={sendData}>
              Join
            </button>
          </div>
        </>
      ) : (
        <div className="user-name">
          <h2>
            {myNickName}{' '}
            <span style={{ fontSize: '0.7rem' }}>in {myRoomName}</span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default Game;
