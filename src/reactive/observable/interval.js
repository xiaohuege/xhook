import { timer } from './timer';
import { asyncScheduler } from '../scheduler/async';

export function interval(period = 0, scheduler = asyncScheduler) {
  if (period < 0) {
    period = 0;
  }

  return timer(period, period, scheduler);
}
