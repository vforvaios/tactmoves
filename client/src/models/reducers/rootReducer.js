import { combineReducers } from 'redux';

import roomsReducer from './roomsReducer';

const rootReducer = combineReducers({
  roomsReducer,
});

export default rootReducer;
