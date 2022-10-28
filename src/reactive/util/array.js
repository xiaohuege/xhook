import _ from 'underscore';
export function isArrayLike(obj) {
  return obj && typeof obj.length === 'number' && !_.isFunction(obj);
}
