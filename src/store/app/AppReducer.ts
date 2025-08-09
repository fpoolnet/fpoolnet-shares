/* Core */
import { PAYOUTS_PUBLIC_KEY, RELAY_URL, SHARES_PUBLIC_KEY } from '@constants/config';
import { ICustomError } from '@interfaces/ICustomError';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { NetworkTypeType } from '@objects/Enums';
import { IHashrateEvent } from '@objects/interfaces/IHashrateEvent';
import { IPayoutEvent } from '@objects/interfaces/IPayoutEvent';
import { ISettings } from '@objects/interfaces/ISettings';
import { IShareEvent } from '@objects/interfaces/IShareEvent';
import {
  changeRelay,
  connectRelay,
  getHashrates,
  getPayouts,
  getShares,
  stopHashrates,
  stopShares
} from '@store/app/AppThunks';

/* Instruments */

/* Types */
export interface AppState {
  address?: string;
  hashrates: IHashrateEvent[];
  shares: IShareEvent[];
  payouts: IPayoutEvent[];
  unconfirmedBalance: number;
  settings: ISettings;
  isHashrateLoading: boolean;
  isSharesLoading: boolean;
  isPayoutsLoading: boolean;
  skeleton: boolean;
  closeSettings: boolean;
  error?: ICustomError;
}

export const initialState: AppState = {
  address: undefined,
  hashrates: [],
  shares: [],
  payouts: [],
  unconfirmedBalance: 0,
  settings: {
    relay: RELAY_URL,
    network: NetworkTypeType.Mainnet,
    payerPublicKey: PAYOUTS_PUBLIC_KEY,
    workProviderPublicKey: SHARES_PUBLIC_KEY
  },
  isHashrateLoading: false,
  isSharesLoading: false,
  isPayoutsLoading: false,
  skeleton: false,
  closeSettings: false,
  error: undefined
};

export const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addAddress: (state: AppState, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.closeSettings = false;
      state.skeleton = false;
    },
    clearAddress: (state: AppState) => {
      state.address = undefined;
    },
    clearHashrates: (state: AppState) => {
      state.hashrates = [];
    },
    clearShares: (state: AppState) => {
      state.shares = [];
    },
    clearPayouts: (state: AppState) => {
      state.payouts = [];
    },
    setHashratesLoader: (state: AppState, action: PayloadAction<boolean>) => {
      state.isHashrateLoading = action.payload;
    },
    setShareLoader: (state: AppState, action: PayloadAction<boolean>) => {
      state.isSharesLoading = action.payload;
    },
    setPayoutLoader: (state: AppState, action: PayloadAction<boolean>) => {
      state.isPayoutsLoading = action.payload;
    },
    setSettings: (state: AppState, action: PayloadAction<ISettings>) => {
      state.settings = action.payload;
    },
    setSkeleton: (state: AppState, action: PayloadAction<boolean>) => {
      state.skeleton = action.payload;
    },
    addPayout: (state: AppState, action: PayloadAction<IPayoutEvent>) => {
      const event = action.payload;
      const eventIndex = state.payouts.findIndex((payout) => payout.id === event.id);

      if (eventIndex != -1) {
        const oldEvent = state.payouts[eventIndex];
        if (!oldEvent.confirmedTx) state.unconfirmedBalance -= event.amount;
        state.payouts[eventIndex] = event;
      } else {
        if (!event.confirmedTx) state.unconfirmedBalance += event.amount;
        state.payouts = [...state.payouts, event];
      }
    },
    addShare: (state: AppState, action: PayloadAction<IShareEvent>) => {
      state.shares = [...state.shares, action.payload];
    },
    addHashrate: (state: AppState, action: PayloadAction<IHashrateEvent>) => {
      state.hashrates = [...state.hashrates, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayouts.pending, (state) => {
        state.payouts = [];
        state.isPayoutsLoading = true;
      })
      .addCase(getPayouts.fulfilled, (state) => {
        state.error = undefined;
      })
      .addCase(getPayouts.rejected, (state, action) => {
        state.error = action.payload;
        state.isPayoutsLoading = false;
      })
      .addCase(getShares.pending, (state) => {
        state.shares = [];
        state.isSharesLoading = true;
      })
      .addCase(getShares.fulfilled, (state) => {
        state.error = undefined;
      })
      .addCase(getShares.rejected, (state, action) => {
        state.error = action.payload;
        state.isSharesLoading = false;
      })
      .addCase(stopShares.pending, (state) => {
        state.error = undefined;
      })
      .addCase(stopShares.fulfilled, (state) => {
        state.shares = [];
      })
      .addCase(stopShares.rejected, (state, action) => {
        state.error = action.payload;
        state.isSharesLoading = false;
      })
      .addCase(getHashrates.pending, (state) => {
        state.hashrates = [];
        state.isHashrateLoading = true;
      })
      .addCase(getHashrates.fulfilled, (state) => {
        state.error = undefined;
      })
      .addCase(getHashrates.rejected, (state, action) => {
        state.error = action.payload;
        state.isHashrateLoading = false;
      })
      .addCase(stopHashrates.pending, (state) => {
        state.error = undefined;
      })
      .addCase(stopHashrates.fulfilled, (state) => {
        state.hashrates = [];
      })
      .addCase(stopHashrates.rejected, (state, action) => {
        state.error = action.payload;
        state.isHashrateLoading = false;
      })
      .addCase(changeRelay.pending, (state) => {
        state.skeleton = false;
        state.error = undefined;
        state.payouts = [];
        state.shares = [];
        state.hashrates = [];
        state.address = undefined;
        state.closeSettings = false;
      })
      .addCase(changeRelay.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.skeleton = true;
        state.closeSettings = true;
      })
      .addCase(changeRelay.rejected, (state, action) => {
        state.error = action.payload;
        state.isPayoutsLoading = false;
        state.isSharesLoading = false;
        state.closeSettings = false;
      })
      .addCase(connectRelay.pending, (state) => {
        state.skeleton = false;
        state.error = undefined;
        state.payouts = [];
        state.address = undefined;
      })
      .addCase(connectRelay.rejected, (state, action) => {
        state.error = action.payload;
        state.isPayoutsLoading = false;
        state.isSharesLoading = false;
      });
  }
});

const { reducer: appReducer } = slice;

export const {
  addHashrate,
  addPayout,
  addShare,
  addAddress,
  clearAddress,
  clearPayouts,
  setHashratesLoader,
  setPayoutLoader,
  setShareLoader,
  setSettings,
  setSkeleton
} = slice.actions;

export default appReducer;
