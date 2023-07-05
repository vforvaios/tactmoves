import { configureStore } from '@reduxjs/toolkit';
// import rootEpics from '@/models/epics/rootEpics';
import roomsReducer from '@/models/reducers/roomsReducer';
import { combineReducers } from 'redux';
// import { createEpicMiddleware } from 'redux-observable';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'state',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    roomsReducer,
  }),
);

// const epicMiddleWare = createEpicMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  // middleware: [epicMiddleWare],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// epicMiddleWare.run(rootEpics);
export default store;
