/* eslint-disable react-hooks/exhaustive-deps */
import {
  setNickName,
  setUsers,
  setChronometer,
  setGameStarted,
} from 'models/actions/roomActions';
import {
  nickName,
  users,
  chronometer,
  gameStared,
} from 'models/selectors/roomSelectors';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';

const Game = ({ socket }) => {
  const nickNameRef = useRef(null);
  const dispatch = useDispatch();
  const myNickName = useSelector(nickName);
  const myChronometer = useSelector(chronometer);
  const myGameStarted = useSelector(gameStared);
  const myUsers = useSelector(users);

  const params = useParams();
  const myRoomName = params?.room;
  const [haveSetNickName, setHaveSetNickName] = useState(myNickName);

  useEffect(() => {
    nickNameRef && nickNameRef?.current?.focus();
    socket.on('message', (payload) => {
      dispatch(
        setUsers([
          ...new Set(
            payload?.users
              ?.filter((us) => us?.user !== myNickName)
              .map((u) => u.user),
          ),
        ]),
      );
    });
  }, [haveSetNickName, socket]);

  useEffect(() => {
    console.log('updated');
    socket.on('minusOneSecond', (payload) => {
      dispatch(setChronometer(payload));
    });

    if (myChronometer === 0) {
      dispatch(setGameStarted());
    }
  }, [socket, myChronometer]);

  const sendData = () => {
    if (!myNickName) {
      alert('Please enter a valid nick name');

      return false;
    } else {
      socket.emit('joinRoom', { user: myNickName, room: params.room });
      setHaveSetNickName(true);
    }
  };

  const startMemorizeChronometer = () => {
    socket.emit('startMemorizeChronometer', { room: myRoomName });
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      sendData();
    }
  };

  return (
    <div className="chat">
      {!haveSetNickName ? (
        <form onKeyPress={handleKeyPress}>
          <div>
            <Input
              ref={nickNameRef}
              placeholder="Input your user name"
              value={myNickName}
              onChange={(e) => dispatch(setNickName(e.target.value))}
            />
          </div>
          <div>
            <Button primary onClick={sendData}>
              Join
            </Button>
          </div>
        </form>
      ) : (
        <div className="user-name">
          <h2>
            {myNickName}{' '}
            <span style={{ fontSize: '0.7rem' }}>in {myRoomName}</span>
          </h2>

          {!myGameStarted ? (
            !myChronometer ? (
              <Button primary onClick={startMemorizeChronometer}>
                Start the game
              </Button>
            ) : (
              <div>{myChronometer}</div>
            )
          ) : (
            <div>Game Started!</div>
          )}
        </div>
      )}
      <ul>
        {myUsers?.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default Game;
