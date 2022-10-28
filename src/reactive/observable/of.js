import { internalFromArray } from './fromArray';

export function of(...args) {
  return internalFromArray(args);
}
