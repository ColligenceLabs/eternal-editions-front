import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { HYDRATE } from 'next-redux-wrapper';

// Type for our state
export interface AuthState {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}

// Initial state
const initialState: AuthState = {
  accessToken: '',
  tokenType: '',
  expiresIn: 0,
  refreshToken: '',
};

// Actual Slice
export const slice = createSlice({
  name: 'abcAuth',
  initialState,
  reducers: {
    // Action to set the authentication status
    setAbcAuth(state, action) {
      state.accessToken = action.payload.accessToken;
      state.tokenType = action.payload.tokenType;
      state.expiresIn = action.payload.expiresIn;
      state.refreshToken = action.payload.refreshToken;
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
export const { setAbcAuth } = slice.actions;

export const selectAccessToken = (state: AppState) => state.abcAuth.accessToken;
