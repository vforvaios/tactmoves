import {
  setNickName,
  setRoom,
  setDifficulty,
} from 'models/actions/roomActions';
import { nickName, room, difficulty } from 'models/selectors/roomSelectors';
import React, { useRef, useEffect } from 'react';
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

  const sendData = () => {
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
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      sendData();
    }
  };

  useEffect(() => {
    nickNameRef.current.focus();
  }, []);

  return (
    <div className="homepage">
      <h1>Welcome to TactMoves</h1>
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
  );
};

export default Home;
