import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { autoReducers } from './autoReducers';

const rootReducer = combineReducers(autoReducers);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['url'], // URLの状態のみ永続化
  debug: true, // デバッグモード有効化
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store, null, () => {
  console.log('[Redux Persist] Rehydration complete');
  console.log('[Redux Persist] Current state:', store.getState());
});

// 初期状態をログ出力
console.log('[Redux Persist] Initial state:', store.getState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
