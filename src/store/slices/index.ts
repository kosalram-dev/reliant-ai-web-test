/*
  This module combines multiple reducers into a single rootReducer for Redux store configuration.
*/

import { combineReducers, type Action } from '@reduxjs/toolkit';
import { type THomeState, reducer as homeReducer } from '@/store/slices/home';

export type RootState = {
  home: THomeState;
};

const appReducer = combineReducers({
  home: homeReducer,
});

const rootReducer = (
  state: RootState | Partial<RootState> | undefined,
  action: Action,
) => {
  if (action.type === 'auth/resetToInitialState') {
    // for all keys defined in your persistConfig(s)
    localStorage.clear();

    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
