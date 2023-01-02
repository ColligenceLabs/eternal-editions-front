import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { HYDRATE } from 'next-redux-wrapper';

interface Wallet {
  wid: number;
  uid: string;
  ucPubkey: string;
  created: string;
}
// Initial state
const initialState: Wallet = {};

// Actual Slice
export const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    // Action to set the authentication status
    setWallet(state, action) {
      state.wid = action.payload.wid;
      state.uid = action.payload.uid;
      state.ucPubkey = action.payload.ucPubkey;
      state.created = action.payload.created;
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log('HYDRATE', state, action.payload);
      return {
        ...state,
        ...action.payload.subject,
      };
    },
  },
});

export default slice.reducer;
export const { setWallet } = slice.actions;
