/* eslint-disable react-hooks/exhaustive-deps */
import {
  setNickName,
  setUsers,
  setGamePuzzle,
  setRowColumnColor,
} from 'models/actions/roomActions';
import {
  nickName,
  users,
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
  const myGamePuzzle = useSelector(gamePuzzle);
  const myUsers = useSelector(users);

  const params = useParams();
  const myRoomName = params?.room;
  const myDifficulty = params?.difficulty;
  const [haveSetNickName, setHaveSetNickName] = useState(myNickName);

  useEffect(() => {
    if (myUsers.length === 1) {
      socket.emit('startTheGame', {
        difficulty: myDifficulty,
        room: myRoomName,
      });
    }
  }, [myUsers]);

  useEffect(() => {
    socket.on('getPuzzle', ({ gameArray }) => {
      dispatch(setGamePuzzle(gameArray));
    });

    socket.on('usersClick', ({ row, column }) => {
      dispatch(setRowColumnColor({ row, column }));
    });
  }, [socket]);

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

  const sendData = () => {
    if (!myNickName) {
      alert('Please enter a valid nick name');

      return false;
    } else {
      socket.emit('joinRoom', {
        user: myNickName,
        room: params.room,
        difficulty: params.difficulty,
      });
      setHaveSetNickName(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      sendData();
    }
  };

  const sendClick = ({ room, row, column }) => {
    dispatch(setRowColumnColor({ row, column }));
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
          <ul className="users">
            {myUsers?.map((user, index) => (
              <li key={index}>{user} has entered the room.</li>
            ))}
          </ul>
          <hr />
          <div className="gamePuzzle">
            {myGamePuzzle?.map((rows, index) => (
              <ul key={`row_${index}`} className="gameRow">
                {rows?.map((row, index2) => (
                  <li
                    style={{ backgroundColor: row }}
                    onClick={() =>
                      sendClick({
                        room: myRoomName,
                        row: index,
                        column: index2,
                        user: myNickName,
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
        </div>
      )}
    </div>
  );
};

export default Game;
