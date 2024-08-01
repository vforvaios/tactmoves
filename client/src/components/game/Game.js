/* eslint-disable react-hooks/exhaustive-deps */
import {
  setNickName,
  setUsers,
  setGamePuzzle,
  setRowColumnColor,
  setRowColumnUser,
  setGameStatusAvailable,
} from 'models/actions/roomActions';
import {
  nickName,
  users,
  gamePuzzle,
  gamePuzzleAttributes,
  gameStatusAvailable,
} from 'models/selectors/roomSelectors';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';

const Game = ({ socket }) => {
  const nickNameRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myNickName = useSelector(nickName);
  const myGamePuzzle = useSelector(gamePuzzle);
  const myUsers = useSelector(users);
  const myGamePuzzleAttributes = useSelector(gamePuzzleAttributes);
  const myGameStatusAvailable = useSelector(gameStatusAvailable);

  const params = useParams();
  const myRoomName = params?.room;
  const [haveSetNickName, setHaveSetNickName] = useState(myNickName);
  const [tempNickName, setTempNickName] = useState('');
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [tempResolvedPuzzle, setTempResolvedPuzzle] = useState();

  const copyGameUrl = () => {
    var dummy = document.createElement('input'),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  useEffect(() => {
    if (myUsers.length === process.env.REACT_APP_MAXIMUL_PLAYERS_IN_ROOM - 1) {
      socket.emit('startTheGame', {
        difficulty: params?.difficulty,
        room: params?.room,
      });
    }
  }, [myUsers]);

  useEffect(() => {
    socket.on('getPuzzle', ({ gameArray, resolvedGame }) => {
      const usersNickName = tempNickName === '' ? myNickName : tempNickName;

      const resolvedPuzzle = gameArray?.map((row, index) =>
        row?.map((col, index2) =>
          resolvedGame[index][index2] === usersNickName ? 'red' : 'yellow',
        ),
      );

      dispatch(setGamePuzzle(gameArray));
      dispatch(setGameStatusAvailable(true));
      setTempResolvedPuzzle(resolvedPuzzle);

      setTimeout(function () {
        setTempResolvedPuzzle([]);
      }, process.env.REACT_APP_TIMEOUT_VANISH_RESOLVED_PUZZLE);
    });

    socket.on('usersClick', ({ row, column, user }) => {
      dispatch(setRowColumnColor({ row, column, user }));
      dispatch(setRowColumnUser({ row, column, user }));
    });

    socket.on('puzzleSolutionCheck', ({ solved }) => {
      console.log(solved);
    });

    socket.on('userLeft', ({ userLeft }) => {
      dispatch(
        setUsers([
          ...new Set(
            myUsers?.filter((us) => us?.user !== userLeft).map((u) => u.user),
          ),
        ]),
      );
    });

    socket.on('numberOfUsers', ({ users }) => {
      setNumberOfUsers(
        users.filter((user) => user?.room === params.room).length,
      );
    });
  }, [socket, myNickName]);

  useEffect(() => {
    if (numberOfUsers > process.env.REACT_APP_MAXIMUL_PLAYERS_IN_ROOM - 1) {
      alert('You cannot play in this room!');
      navigate('/');
    }
  }, [numberOfUsers]);

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
    if (!tempNickName) {
      alert('Please enter a valid nick name');

      return false;
    } else {
      dispatch(setNickName(tempNickName));
      socket.emit('joinRoom', {
        user: tempNickName,
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
    dispatch(setRowColumnColor({ row, column, user: myNickName }));
    dispatch(setRowColumnUser({ row, column, user: myNickName }));
    socket.emit('playerClickedSquare', {
      room,
      row,
      column,
      user: myNickName,
    });
  };

  const gameBoard =
    tempResolvedPuzzle?.length > 0 ? tempResolvedPuzzle : myGamePuzzle;

  return (
    <div className="chat">
      {!haveSetNickName ? (
        <form onKeyDown={handleKeyPress}>
          <div>
            <Input
              ref={nickNameRef}
              placeholder="Input your user name"
              value={tempNickName}
              onChange={(e) => setTempNickName(e.target.value)}
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
            <div>
              {myNickName}{' '}
              <span style={{ fontSize: '0.7rem' }}>in {myRoomName}</span>
            </div>
            <Button secondary onClick={copyGameUrl}>
              Copy Game Link
            </Button>
          </h2>
          <ul className="users">
            {myUsers?.map((user, index) => (
              <li key={index}>{user} has entered the room.</li>
            ))}
          </ul>
          <hr />
          <div className="gamePuzzle">
            {gameBoard?.map((rows, index) => (
              <ul key={`row_${index}`} className="gameRow">
                {rows?.map((row, index2) => (
                  <li
                    style={{
                      backgroundColor: row,
                    }}
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
                    {myGamePuzzleAttributes?.[index]?.[index2]}
                  </li>
                ))}
              </ul>
            ))}
            {myGameStatusAvailable && (
              <div className="mt-12">
                <Button
                  primary
                  onClick={() =>
                    socket.emit('checkGameEnd', {
                      room: params.room,
                      currentPuzzleStatus: myGamePuzzleAttributes,
                    })
                  }>
                  Check Game Status
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
