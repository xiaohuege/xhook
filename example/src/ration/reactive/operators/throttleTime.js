import { asyncScheduler } from '../scheduler/async';
import { defaultThrottleConfig, throttle } from './throttle';
import { timer } from '../observable/timer';

export function throttleTime(duration, scheduler = asyncScheduler, config = defaultThrottleConfig) {
  const duration$ = timer(duration, scheduler);
  return throttle(() => duration$, config);
}
