import { Container } from 'typedi';
import { ISettings } from '@objects/interfaces/ISettings';
import { RelayService } from '@services/api/RelayService';
import { createAppAsyncThunk } from '@store/createAppAsyncThunk';
import { IShareEvent } from '@objects/interfaces/IShareEvent';
import { beautify } from '@utils/beautifierUtils';
import {
  addHashrate,
  addPayout,
  addPayouts,
  addShare,
  addShares,
  setShareEose,
  setHashratesLoader,
  setPayoutEose,
  setPayoutLoader,
  setShareLoader,
  setSkeleton
} from './AppReducer';
import { IPayoutEvent } from '@objects/interfaces/IPayoutEvent';

export const getPayouts = createAppAsyncThunk(
  'relay/getPayouts',
  async (address: string, { rejectWithValue, dispatch }) => {
    try {
      const eose = false;
      let events: IPayoutEvent[] = [];
      const relayService: any = Container.get(RelayService);
      relayService.subscribePayouts(address, {
        onevent: (event: any) => {
          const payoutEvent = beautify(event);
          if (eose) {
            dispatch(addPayout(payoutEvent));
          } else {
            events.push(payoutEvent);
          }
        },
        oneose: () => {
          dispatch(setPayoutEose(true));
          dispatch(addPayouts(events));
          events = [];
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

export const getShares = createAppAsyncThunk(
  'relay/getShares',
  async (address: string, { rejectWithValue, dispatch }) => {
    try {
      const eose = false;
      let events: IShareEvent[] = [];
      const relayService: any = Container.get(RelayService);
      relayService.subscribeShares(address, {
        onevent: (event: any) => {
          const shareEvent = beautify(event);
          if (eose) {
            dispatch(addShare(shareEvent));
          } else {
            events.push(shareEvent);
          }
        },
        oneose: () => {
          dispatch(setShareEose(true));
          dispatch(addShares(events));
          events = [];
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

export const stopPayouts = createAppAsyncThunk(
  'relay/stopPayouts',
  async (_, { rejectWithValue }) => {
    try {
      const relayService: any = Container.get(RelayService);
      relayService.stopPayouts();
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



export const stopShares = createAppAsyncThunk(
  'relay/stopShares',
  async (_, { rejectWithValue }) => {
    try {
      const relayService: any = Container.get(RelayService);
      relayService.stopShares();
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
      const relayService: any = Container.get(RelayService);
      relayService.subscribeHashrates(address, {
        onevent: (event: any) => {
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
      const relayService: any = Container.get(RelayService);
      relayService.stopHashrates();
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

export const connectRelay = createAppAsyncThunk(
  'relay/connectRelay',
  async (settings: ISettings, { rejectWithValue, dispatch }) => {
    try {
      const relayService: any = Container.get(RelayService);
      await relayService.connectRelay(settings.relay);
      return settings;
    } catch (err: any) {
      dispatch(setSkeleton(true));
      return rejectWithValue({
        message: err?.message || err,
        code: err.code,
        status: err.status
      });
    }
  }
);

export const changeRelay = createAppAsyncThunk(
  'relay/changeRelay',
  async (settings: ISettings, { rejectWithValue, dispatch }) => {
    try {
      const relayService: any = Container.get(RelayService);
      await relayService.connectRelay(settings.relay);
      return settings;
    } catch (err: any) {
      dispatch(setSkeleton(true));
      return rejectWithValue({
        message: err?.message || err,
        code: err.code,
        status: err.status
      });
    }
  }
);
