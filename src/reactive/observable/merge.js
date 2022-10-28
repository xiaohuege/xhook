import { mergeAll } from '../operators/mergeAll';
import { internalFromArray } from './fromArray';
import { innerFrom } from './from';
import { EMPTY } from './empty';
import { popNumber, popScheduler } from '../util/args';

export function merge(...args) {
  const scheduler = popScheduler(args);
  const concurrent = popNumber(args, Infinity);
  const sources = args;
  const len = sources.length;
  if (!len) {
    return EMPTY;
  }
  if (len == 1) {
    return innerFrom(sources[0]);
  }
  return mergeAll(concurrent)(internalFromArray(sources, scheduler));
}
