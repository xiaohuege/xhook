import { isScheduler } from './isScheduler';
import _ from 'underscore';

function last(arr) {
  return arr[arr.length - 1];
}

export function popResultSelector(args) {
  return _.isFunction(last(args)) ? args.pop() : undefined;
}

export function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : undefined;
}

export function popNumber(args, defaultValue) {
  return typeof last(args) === 'number' ? args.pop() : defaultValue;
}

export function popString(args, defaultValue) {
  return typeof last(args) === 'string' ? args.pop() : defaultValue;
}

const { getPrototypeOf, prototype: objectProto, keys: getKeys } = Object;
export function argsArgArrayOrObject(args) {
  if (args.length === 1) {
    const first = args[0];
    if (_.isArray(first)) {
      return { args: first, keys: null };
    }
    if (isPOJO(first)) {
      const keys = getKeys(first);
      return {
        args: keys.map(key => first[key]),
        keys,
      };
    }
  }

  return { args, keys: null };
}

function isPOJO(obj) {
  return obj && typeof obj === 'object' && getPrototypeOf(obj) === objectProto;
}

export function argsOrArgArray(args) {
  return args.length === 1 && _.isArray(args[0]) ? args[0] : args;
}
