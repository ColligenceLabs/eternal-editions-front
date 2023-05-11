import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  onLogin: false,
};

const onLogin = createSlice({
  name: 'onLogin',
  initialState,
  reducers: {
    setOnLogin: (state, action) => {
      state.onLogin = action.payload;
    },
  },
});

export const { setOnLogin } = onLogin.actions;

export default onLogin.reducer;
