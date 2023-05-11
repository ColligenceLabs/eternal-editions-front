import { combineReducers } from 'redux';
import abcAuth from './slices/abcAuth';
import user from './slices/user';
import webUser from './slices/webUser';
import wallet from './slices/wallet';
import twoFa from './slices/twoFa';
import onLogin from 'src/store/slices/onLogin';

import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import onLogin from 'src/store/slices/onLogin';

const persistConfig = {
  key: 'root',
  // localStorage에 저장합니다.
  // storage,
  storage: storageSession,
  // auth, board, studio 3개의 reducer 중에 auth reducer만 localstorage에 저장합니다.
  whitelist: ['user', 'abcAuth', 'wallet', 'webUser', 'twoFa', 'onLogin'],
  // blacklist -> 그것만 제외합니다
};

export const rootReducers = combineReducers({
  abcAuth,
  user,
  webUser,
  wallet,
  twoFa,
  onLogin,
});

export const persistedReducer = persistReducer(persistConfig, rootReducers);
// export default RootReducers;
// export  persistReducer(persistConfig, rootReducers);
