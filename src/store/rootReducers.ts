import { combineReducers } from 'redux';
import abcAuth from './slices/abcAuth';
import user from './slices/user';
import wallet from './slices/wallet';
import twoFa from './slices/twoFa';

const RootReducers = combineReducers({
  abcAuth,
  user,
  wallet,
  twoFa,
});

export default RootReducers;
