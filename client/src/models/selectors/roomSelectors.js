const room = ({ roomReducer }) => roomReducer.room;
const nickName = ({ roomReducer }) => roomReducer.nickName;
const users = ({ roomReducer }) => roomReducer.users;
const difficulty = ({ roomReducer }) => roomReducer.difficulty;
const gamePuzzle = ({ roomReducer }) => roomReducer.gamePuzzle;

export { room, nickName, users, difficulty, gamePuzzle };
