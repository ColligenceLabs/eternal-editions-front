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
    id_token: '',
    service: '',
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
        id_token: '',
        service: '',
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
    setProvider: (state, action) => {
      state.user = {
        ...state.user,
        provider_id: action.payload.id_token,
        service: action.payload.service,
      };
    },
  },
});

export const { initWebUser, setWebUser, setProvider } = userSlice.actions;

export default userSlice.reducer;
