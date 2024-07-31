/* eslint-disable react-hooks/exhaustive-deps */
import {
  setNickName,
  setRoom,
  setDifficulty,
} from 'models/actions/roomActions';
import { nickName, room, difficulty } from 'models/selectors/roomSelectors';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Dropdown, Button } from 'semantic-ui-react';

import gameConfiguration from '../../config';

const Home = ({ socket }) => {
  const dispatch = useDispatch();
  const myNickName = useSelector(nickName);
  const myRoomName = useSelector(room);
  const myDifficulty = useSelector(difficulty);
  const nickNameRef = useRef(null);
  const [numberOfUsers, setNumberOfUsers] = useState(0);

  const sendData = () => {
    if (numberOfUsers !== 0) {
      alert('Cannot create this room as it already exists');
      window.location.reload();
    } else {
      if (myNickName !== '' && myRoomName !== '' && myDifficulty) {
        socket.emit('joinRoom', {
          user: myNickName,
          room: myRoomName,
          difficulty: myDifficulty?.value,
        });
      } else {
        alert('nick name, room name and difficulty are a must!');
        window.location.reload();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      sendData();
    }
  };

  useEffect(() => {
    nickNameRef.current.focus();
  }, []);

  useEffect(() => {
    socket.on('numberOfUsers', ({ users }) => {
      setNumberOfUsers(
        users.filter((user) => user?.room === myRoomName).length,
      );
    });
  }, [socket]);

  return (
    <div className="homepage">
      <div className="small-container">
        <h1>Welcome to TactMoves</h1>
        <form onKeyDown={handleKeyPress}>
          <div>
            <Input
              ref={nickNameRef}
              placeholder="Input your user name"
              value={myNickName}
              onChange={(e) => dispatch(setNickName(e.target.value))}
            />
          </div>
          <div>
            <Input
              placeholder="Input the room name"
              value={myRoomName}
              onChange={(e) => dispatch(setRoom(e.target.value))}
            />
          </div>
          <div>
            <Dropdown
              placeholder="Select Difficulty"
              fluid
              selection
              options={gameConfiguration?.levels}
              onChange={(e, { value }) => dispatch(setDifficulty({ value }))}
              value={difficulty?.value}
            />
          </div>
          <div>
            <Link to={`/game/${myRoomName}/${myDifficulty?.value}`}>
              <Button primary onClick={sendData}>
                Join
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
