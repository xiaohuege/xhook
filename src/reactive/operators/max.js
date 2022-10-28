import { reduce } from './reduce';
import _ from 'underscore';

export function max(comparer) {
  let func = comparer;
  if (!_.isFunction(func)) {
    func = (a, b) => (a > b ? a : b);
  }
  return reduce((a, b) => func(a, b));
}
