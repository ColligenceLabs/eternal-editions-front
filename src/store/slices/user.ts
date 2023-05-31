import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { UserModel } from '../../abc/main/accounts/interface';

// Initial state
const initialState: UserModel = {};

// Actual Slice
export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set the authentication status
    setUser(state, action) {
      state.EncPV = action.payload?.EncPV;
      state.uid = action.payload?.uid;
      state.wid = action.payload?.wid;
      state.email = action.payload?.email;
      state.abcUid = action.payload?.abcUid;
      state.accounts = action.payload?.accounts;
      state.favorites = action.payload?.favorites;
      state.autoconfirms = action.payload?.autoconfirms;
      state.twoFactorEnabled = action.payload?.twoFactorEnabled;
      state.twoFactorFreezeEndTime = action.payload?.twoFactorFreezeEndTime;
      state.twoFactorResetRetryCount = action.payload?.twoFactorResetRetryCount;
      state.twoFactorRetryFreezeEndTime = action.payload?.twoFactorRetryFreezeEndTime;
      state.tempTwoFactorSecret = action.payload?.tempTwoFactorSecret;
      state.twoFactorSecret = action.payload?.twoFactorSecret;
      state.twoFAResetCode = action.payload?.twoFAResetCode;
    },
    delUser(state) {
      state.uid = '';
      state.email = '';
      state.abcUid = '';
      state.accounts = [];
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
export const { setUser, delUser } = slice.actions;
