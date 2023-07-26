const room = ({ roomReducer }) => roomReducer.room;
const nickName = ({ roomReducer }) => roomReducer.nickName;
const users = ({ roomReducer }) => roomReducer.users;
const difficulty = ({ roomReducer }) => roomReducer.difficulty;
const chronometer = ({ roomReducer }) => roomReducer.chronometer;
const gameStared = ({ roomReducer }) => roomReducer.gameStared;
const gamePuzzle = ({ roomReducer }) => roomReducer.gamePuzzle;

export {
  room,
  nickName,
  users,
  difficulty,
  chronometer,
  gameStared,
  gamePuzzle,
};
