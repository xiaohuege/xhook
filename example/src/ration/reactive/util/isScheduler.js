import _ from 'underscore';

export function isScheduler(value) {
  return value && _.isFunction(value.schedule);
}
