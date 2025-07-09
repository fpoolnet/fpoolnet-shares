import { ISettings } from '@objects/interfaces/ISettings';
import RelayService from '@services/api/RelayService';
import { createAppAsyncThunk } from '@store/createAppAsyncThunk';
import { beautify } from '@utils/beautifierUtils';
import {
  addHashrate,
  addPayout,
  addShare,
  setHashratesLoader,
  setPayoutEose,
  setPayoutLoader,
  setShareLoader
} from './AppReducer';

export const getPayouts = createAppAsyncThunk(
  'relay/getPayouts',
  async (address: string, { rejectWithValue, dispatch }) => {
    try {
      RelayService.subscribePayouts(address, {
        onevent: (event) => {
          const payoutEvent = beautify(event);
          dispatch(addPayout(payoutEvent));
        },
        oneose: () => {
          dispatch(setPayoutEose(true));
          setTimeout(() => {
            dispatch(setPayoutLoader(false));
          }, 500);
        }
      });
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message,
        code: err.code,
        status: err.status
      });
    }
  }
);

export const stopPayouts = createAppAsyncThunk(
  'relay/stopPayouts',
  async (_, { rejectWithValue }) => {
    try {
      RelayService.stopPayouts();
      return;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message,
        code: err.code,
        status: err.status
      });
    }
  }
);

export const getShares = createAppAsyncThunk(
  'relay/getShares',
  async (address: string, { rejectWithValue, dispatch }) => {
    try {
      RelayService.subscribeShares(address, {
        onevent: (event) => {
          const shareEvent = beautify(event);
          dispatch(addShare(shareEvent));
        },
        oneose: () => {
          setTimeout(() => {
            dispatch(setShareLoader(false));
          }, 500);
        }
      });
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message,
        code: err.code,
        status: err.status
      });
    }
  }
);

export const stopShares = createAppAsyncThunk(
  'relay/stopShares',
  async (_, { rejectWithValue }) => {
    try {
      RelayService.stopShares();
      return;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message,
        code: err.code,
        status: err.status
      });
    }
  }
);

export const getHashrates = createAppAsyncThunk(
  'relay/getHashrates',
  async (address: string, { rejectWithValue, dispatch }) => {
    try {
      RelayService.subscribeHashrates(address, {
        onevent: (event) => {
          const hashrateEvent = beautify(event);
          dispatch(addHashrate(hashrateEvent));
        },
        oneose: () => {
          setTimeout(() => {
            dispatch(setHashratesLoader(false));
          }, 500);
        }
      });
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message,
        code: err.code,
        status: err.status
      });
    }
  }
);

export const stopHashrates = createAppAsyncThunk(
  'relay/stopHashrate',
  async (_, { rejectWithValue }) => {
    try {
      RelayService.stopHashrates();
      return;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message,
        code: err.code,
        status: err.status
      });
    }
  }
);

export const changeRelay = createAppAsyncThunk(
  'relay/changeRelay',
  async (settings: ISettings, { rejectWithValue }) => {
    try {
      await RelayService.changeRelay(settings.relay);
      return settings;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message || err,
        code: err.code,
        status: err.status
      });
    }
  }
);
