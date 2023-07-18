import { configureStore } from '@reduxjs/toolkit';
import roomReducer from 'models/reducers/roomReducer';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'state',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    roomReducer,
  }),
);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
