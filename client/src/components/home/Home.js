import { setNickName, setRoom } from 'models/actions/roomActions';
import { nickName, room } from 'models/selectors/roomSelectors';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = ({ socket }) => {
  const dispatch = useDispatch();
  const myNickName = useSelector(nickName);
  const myRoomName = useSelector(room);

  const sendData = () => {
    if (myNickName !== '' && myRoomName !== '') {
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
        <input
          placeholder="Input your user name"
          value={myNickName}
          onChange={(e) => dispatch(setNickName(e.target.value))}
        />
      </div>
      <div>
        <input
          placeholder="Input the room name"
          value={myRoomName}
          onChange={(e) => dispatch(setRoom(e.target.value))}
        />
      </div>
      <div>
        <Link to={`/game/${myRoomName}/${myNickName}`}>
          <button className="next" onClick={sendData}>
            Join
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
