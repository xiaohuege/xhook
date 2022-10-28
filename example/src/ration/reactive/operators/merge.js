import { operate } from '../util/lift';
import { argsOrArgArray, popNumber, popScheduler } from '../util/args';
import { internalFromArray } from '../observable/fromArray';
import { mergeAll } from './mergeAll';

export function merge(...args) {
  const scheduler = popScheduler(args);
  const concurrent = popNumber(args, Infinity);
  args = argsOrArgArray(args);

  return operate((source, subscriber) => {
    mergeAll(concurrent)(internalFromArray([source, ...args], scheduler)).subscribe(subscriber);
  });
}
