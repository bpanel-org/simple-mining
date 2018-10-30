import { UPDATE_COINBASE_ADDRESS } from './constants';

export function minerReducer(state = { coinbaseAddress: '' }, action) {
  const { type, payload } = action;
  let newState = { ...state };

  switch (type) {
    case UPDATE_COINBASE_ADDRESS: {
      newState.coinbaseAddress = payload;
      return newState;
    }

    default: {
      return state;
    }
  }
}
