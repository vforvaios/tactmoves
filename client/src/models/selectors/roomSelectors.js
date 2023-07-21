const room = ({ roomReducer }) => roomReducer.room;
const nickName = ({ roomReducer }) => roomReducer.nickName;
const users = ({ roomReducer }) => roomReducer.users;
const difficulty = ({ roomReducer }) => roomReducer.difficulty;
const chronometer = ({ roomReducer }) => roomReducer.chronometer;

export { room, nickName, users, difficulty, chronometer };
