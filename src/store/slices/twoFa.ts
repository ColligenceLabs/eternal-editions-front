import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { HYDRATE } from 'next-redux-wrapper';

// Type for our state
export interface TwoFa {
  secret: string;
  reset: string;
}

// Initial state
const initialState: TwoFa = {
  secret: '',
  reset: '',
};

// Actual Slice
export const slice = createSlice({
  name: 'twoFa',
  initialState,
  reducers: {
    // Action to set the authentication status
    setTwoFa(state, action) {
      state.secret = action.payload.secret;
      state.reset = action.payload.reset;
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
export const { setTwoFa } = slice.actions;

export const selectResetCode = (state: AppState) => state.twoFa.reset;
