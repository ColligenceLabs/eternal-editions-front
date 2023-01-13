import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    uid: '',
    provider_id: '',
    auth_type: '',
    provider_data: '',
    eth_address: '',
    role: '',
    name: '',
    email: '',
    profile_image: '',
    banner_image: '',
    twitter: '',
    instagram: '',
    site: '',
    createdAt: '',
    updatedAt: '',
    session: {},
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initWebUser: (state) => {
      state.user = {
        uid: '',
        provider_id: '',
        auth_type: '',
        provider_data: '',
        eth_address: '',
        role: '',
        name: '',
        email: '',
        profile_image: '',
        banner_image: '',
        twitter: '',
        instagram: '',
        site: '',
        createdAt: '',
        updatedAt: '',
        session: {},
      };
    },
    setWebUser: (state, action) => {
      if (action.payload.session?.__lastAccess) delete action.payload.session.__lastAccess;
      if (JSON.stringify(state.user) !== JSON.stringify(action.payload)) {
        // 바뀐 data가 있을 때만 set 한다.
        state.user = Object.assign({}, state.user, action.payload);
      }
      const nftapiJwtToken = action.payload.session?.dropsUser?.nftapiJwtToken;
      if (nftapiJwtToken) localStorage.setItem('nftapiJwtToken', nftapiJwtToken);
    },
  },
});

export const { initWebUser, setWebUser } = userSlice.actions;

export default userSlice.reducer;
