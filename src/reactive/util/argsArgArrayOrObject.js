import _ from 'underscore';
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
