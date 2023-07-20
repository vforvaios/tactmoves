import {
  setNickName,
  setRoom,
  setDifficulty,
} from 'models/actions/roomActions';
import { nickName, room, difficulty } from 'models/selectors/roomSelectors';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Dropdown } from 'semantic-ui-react';

import gameConfiguration from '../../config';

const Home = ({ socket }) => {
  const dispatch = useDispatch();
  const myNickName = useSelector(nickName);
  const myRoomName = useSelector(room);
  const myDifficulty = useSelector(difficulty);

  const sendData = () => {
    if (myNickName !== '' && myRoomName !== '' && myDifficulty === -1) {
      socket.emit('joinRoom', { user: myNickName, room: myRoomName });
    } else {
      alert('nick name and room name are a must!');
      window.location.reload();
    }
  };

  return (
    <div className="homepage">
      <h1>Welcome to TactMoves</h1>
      <div>
        <Input
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
        <Link to={`/game/${myRoomName}`}>
          <button className="next" onClick={sendData}>
            Join
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
