import { operate } from '../util/lift';
import { scanInternals } from './scanInternals';

export function reduce(accumulator, seed) {
  return operate(scanInternals(accumulator, seed, arguments.length >= 2, false, true));
}
