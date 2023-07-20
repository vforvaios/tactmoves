import { combineEpics } from 'redux-observable';

import roomEpics from './roomEpics';
const rootEpics = combineEpics(roomEpics);

export default rootEpics;
