import { configureStore } from '@reduxjs/toolkit';
import rootEpics from 'models/epics/rootEpics';
import roomReducer from 'models/reducers/roomReducer';
import { combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

const persistConfig = {
  key: 'state',
  storage: storageSession,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    roomReducer,
  }),
);

const epicMiddleWare = createEpicMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    // (getDefaultMiddleware) =>
    //   getDefaultMiddleware({
    //     serializableCheck: false,
    //   }),
    epicMiddleWare,
  ],
  devTools: process.env.NODE_ENV !== 'production',
});

epicMiddleWare.run(rootEpics);
export default store;
