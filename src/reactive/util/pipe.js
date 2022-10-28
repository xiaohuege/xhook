import { identity } from './identity';
export function pipe(...funcs) {
  return pipeFromArray(funcs);
}

export function pipeFromArray(funcs) {
  const len = funcs.length;
  if (len == 0) {
    return identity;
  }
  if (len == 1) {
    return funcs[0];
  }
  return function pipe(input) {
    return funcs.reduce((prev, fn) => fn(prev), input);
  };
}
