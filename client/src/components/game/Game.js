/* eslint-disable react-hooks/exhaustive-deps */
import {
  setNickName,
  setUsers,
  setChronometer,
} from 'models/actions/roomActions';
import { nickName, users, chronometer } from 'models/selectors/roomSelectors';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';

const Game = ({ socket }) => {
  const dispatch = useDispatch();
  const myNickName = useSelector(nickName);
  const myChronometer = useSelector(chronometer);
  const myUsers = useSelector(users);

  const params = useParams();
  const myRoomName = params?.room;
  const [haveSetNickName, setHaveSetNickName] = useState(myNickName);

  useEffect(() => {
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
  }, [socket, myChronometer]);

  const sendData = () => {
    socket.emit('joinRoom', { user: myNickName, room: params.room });
    setHaveSetNickName(true);
  };

  const startMemorizeChronometer = () => {
    socket.emit('startMemorizeChronometer', { room: myRoomName });
  };

  return (
    <div className="chat">
      {!haveSetNickName ? (
        <>
          <div>
            <Input
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
        </>
      ) : (
        <div className="user-name">
          <h2>
            {myNickName}{' '}
            <span style={{ fontSize: '0.7rem' }}>in {myRoomName}</span>
          </h2>

          {!myChronometer ? (
            <Button primary onClick={startMemorizeChronometer}>
              Start the game
            </Button>
          ) : (
            <div>{myChronometer}</div>
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
