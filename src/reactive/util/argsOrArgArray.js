import _ from 'underscore';

export function argsOrArgArray(args) {
  return args.length === 1 && _.isArray(args[0]) ? args[0] : args;
}
