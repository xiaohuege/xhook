import { reduce } from './reduce';
import _ from 'underscore';

export function min(comparer) {
  let func = comparer;
  if (!_.isFunction(func)) {
    func = (a, b) => {
      let res = a < b ? a : b;
      return res;
    };
  }
  return reduce((a, b) => func(a, b));
}
