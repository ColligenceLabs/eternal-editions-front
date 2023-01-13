import { combineReducers } from 'redux';
import abcAuth from './slices/abcAuth';
import user from './slices/user';
import webUser from './slices/webUser';
import wallet from './slices/wallet';
import twoFa from './slices/twoFa';

import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';

const persistConfig = {
  key: 'root',
  // localStorage에 저장합니다.
  // storage,
  storage: storageSession,
  // auth, board, studio 3개의 reducer 중에 auth reducer만 localstorage에 저장합니다.
  whitelist: ['user'],
  // blacklist -> 그것만 제외합니다
};

const RootReducers = combineReducers({
  abcAuth,
  user,
  webUser,
  wallet,
  twoFa,
});

// export default RootReducers;
export default persistReducer(persistConfig, RootReducers);
