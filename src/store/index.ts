/**
 * Store Component
 * 
 * This module sets up and configures Redux store using @reduxjs/toolkit and 
 * redux-persist for state persistence.
 */
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/store/slices';

import { useDispatch, useSelector as useReduxSelector } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer,
) as typeof rootReducer;

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: persistedReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useSelector = useReduxSelector;

export const persistor = persistStore(store);
