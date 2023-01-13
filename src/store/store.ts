import { applyMiddleware, createStore, compose } from 'redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import logger from 'redux-logger';
import { createWrapper } from 'next-redux-wrapper';
import { persistedReducer, rootReducers } from './rootReducers';
import storage from 'redux-persist';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import abcAuth from './slices/abcAuth';
import wallet from './slices/wallet';
// const makeStore = () =>
//   configureStore({
//     reducer: RootReducers,
//     devTools: true,
//   });
//
// export type AppStore = ReturnType<typeof makeStore>;
// export type AppState = ReturnType<AppStore['getState']>;
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;
//
// export const wrapper = createWrapper<AppStore>(makeStore);

// const persistConfig = {
//   key: 'root',
//   // localStorage에 저장합니다.
//   // storage,
//   storage: storageSession,
//   // auth, board, studio 3개의 reducer 중에 auth reducer만 localstorage에 저장합니다.
//   whitelist: ['user', 'abcAuth', 'wallet'],
//   // blacklist -> 그것만 제외합니다
// };
//
// const persistedReducer = persistReducer(persistConfig, RootReducers);
// const makeConfiguredStore = (reducer) => createStore(reducer, undefined, applyMiddleware(logger));
const makeConfiguredStore = (reducer: any) =>
  configureStore({
    reducer: reducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return makeConfiguredStore(rootReducers);
  } else {
    // we need it only on client side
    const store = makeConfiguredStore(persistedReducer);
    let persistor = persistStore(store);
    return { persistor, ...store };
  }
};

// wrapper 로 감싸기
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== 'production',
});
