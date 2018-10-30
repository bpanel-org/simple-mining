import { UPDATE_COINBASE_ADDRESS } from './constants';

export function updateCoinbaseAddress(addr) {
  return {
    type: UPDATE_COINBASE_ADDRESS,
    payload: addr
  };
}
