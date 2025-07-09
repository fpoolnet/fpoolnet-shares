/* Instruments */
import type { ReduxState } from '@store/store';

export const getAddress = (state: ReduxState) => state.address;
export const getUnconfirmedBalance = (state: ReduxState) => state.unconfirmedBalance;
export const getSettings = (state: ReduxState) => state.settings;

export const getPayouts = (state: ReduxState) => state.payouts;
export const getHashrates = (state: ReduxState) => state.hashrates;
export const getShares = (state: ReduxState) => state.shares;

export const getHashratesCount = (state: ReduxState) => state.shares.length;
export const getSharesCount = (state: ReduxState) => state.shares.length;
export const getPayoutsCount = (state: ReduxState) => state.payouts.length;

export const getIsHashratesLoading = (state: ReduxState) => state.isHashrateLoading;
export const getIsSharesLoading = (state: ReduxState) => state.isSharesLoading;
export const getIsPayoutsLoading = (state: ReduxState) => state.isPayoutsLoading;
