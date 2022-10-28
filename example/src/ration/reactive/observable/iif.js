import { defer } from './defer';

export function iif(condition, trueObj, falseObj) {
  return defer(() => (condition() ? trueObj : falseObj));
}
