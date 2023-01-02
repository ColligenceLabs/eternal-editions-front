import { combineReducers } from 'redux';
import abcAuth from './slices/abcAuth';
import user from './slices/user';
import wallet from './slices/wallet';

const RootReducers = combineReducers({
  abcAuth,
  user,
  wallet,
});

export default RootReducers;
