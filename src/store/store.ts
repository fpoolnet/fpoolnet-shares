import {
  type TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import type { ThunkDispatch } from 'redux-thunk';
import { type Action, configureStore, type ThunkAction } from '@reduxjs/toolkit';
import { errorMiddleware } from '@middlewares/ErrorMiddleware';
import { loggerMiddleware } from '@middlewares/LoggerMiddleware';
import app from '@store/app/AppReducer';

const persistConfig = {
  key: 'fpool',
  storage,
  whitelist: ['address', 'settings'],
  stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, app);

export const AppStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['register']
      }
    }).concat(loggerMiddleware, errorMiddleware)
});

export type ReduxState = ReturnType<typeof AppStore.getState>;
export type ReduxDispatch = ThunkDispatch<ReduxState, unknown, Action>;

export const persistor = persistStore(AppStore);
export const useDispatch: () => ReduxDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;

/* Types */
export type ReduxStore = typeof AppStore;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;
