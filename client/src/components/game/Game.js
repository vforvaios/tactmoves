/* eslint-disable react-hooks/exhaustive-deps */
import {
  setNickName,
  setUsers,
  setChronometer,
  setGameStarted,
  setGamePuzzle,
} from 'models/actions/roomActions';
import {
  nickName,
  users,
  chronometer,
  gameStared,
  gamePuzzle,
  difficulty,
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
  const myGamePuzzle = useSelector(gamePuzzle);
  const myGameStarted = useSelector(gameStared);
  const myUsers = useSelector(users);
  const myDifficulty = useSelector(difficulty);

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
    socket.on('minusOneSecond', (payload) => {
      dispatch(setChronometer(payload));
    });

    if (myChronometer === 0) {
      dispatch(setGameStarted());
      socket.emit('startTheGame', {
        room: myRoomName,
        difficulty: myDifficulty?.value || myUsers?.[0]?.difficulty,
      });
    }

    socket.on('getPuzzle', ({ gameArray }) => {
      dispatch(setGamePuzzle(gameArray));
    });

    socket.on('usersClick', ({ row, column }) => {
      alert(`Clicked ${row}${column}`);
    });
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

  const sendClick = ({ room, row, column }) => {
    socket.emit('playerClickedSquare', { room, row, column });
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
            <div className="gamePuzzle">
              {myGamePuzzle?.map((rows, index) => (
                <ul key={`row_${index}`} className="gameRow">
                  {rows?.map((row, index2) => (
                    <li
                      onClick={() =>
                        sendClick({
                          room: myRoomName,
                          row: index,
                          column: index2,
                        })
                      }
                      key={`row_${index}_col_${index2}`}
                      className="gameCol">
                      row_{index}_col_{index2}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
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
