import { Observable } from '../Observable';
import { asyncScheduler } from '../scheduler/async';
import { isValidDate } from '../util/time';
import { isScheduler } from '../util/isScheduler';

export function timer(dueTime, intervalOrScheduler, scheduler = asyncScheduler) {
  let intervalDuration = -1;
  if (intervalOrScheduler != null) {
    if (isScheduler(intervalOrScheduler)) {
      scheduler = intervalOrScheduler;
    } else {
      intervalDuration = intervalOrScheduler;
    }
  }
  return new Observable((subscriber) => {
    let due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
    if (due < 0) {
      due = 0;
    }

    let n = 0;

    return scheduler.schedule(function () {
      if (!subscriber.closed) {
        subscriber.next(n);
        n += 1;
        if (0 <= intervalDuration) {
          this.schedule(undefined, intervalDuration);
        } else {
          subscriber.complete();
        }
      }
    }, due);
  });
}
