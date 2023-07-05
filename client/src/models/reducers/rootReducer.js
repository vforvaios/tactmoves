import { combineReducers } from 'redux';

import roomsReducer from './roomsReducer';
import catalogReducer from './catalogReducer';

const rootReducer = combineReducers({
  roomsReducer,
});

export default rootReducer;
