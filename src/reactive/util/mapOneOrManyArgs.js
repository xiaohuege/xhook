import { map } from '../operators/map';
import _ from 'underscore';

function callOrApply(fn, args) {
  return _.isArray(args) ? fn(...args) : fn(args);
}

export function mapOneOrManyArgs(fn) {
  return map(args => callOrApply(fn, args));
}
