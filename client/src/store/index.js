import { configureStore } from '@reduxjs/toolkit';
import roomReducer from 'models/reducers/roomReducer';
import { combineReducers } from 'redux';
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

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
