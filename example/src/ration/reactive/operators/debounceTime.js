import { asyncScheduler } from '../scheduler/async';
import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';

export function debounceTime(dueTime, scheduler = asyncScheduler) {
  return operate((source, subscriber) => {
    let activeTask = null;
    let lastValue = null;
    let lastTime = null;

    const emit = (id) => {
      if (activeTask) {
        activeTask.unsubscribe();
        activeTask = null;
        const value = lastValue;
        lastValue = null;
        subscriber.next(value, id);
      }
    };
    function emitWhenIdle(id) {
      const targetTime = (lastTime || 0) + dueTime;
      const now = scheduler.now();
      if (now < targetTime) {
        activeTask = this.schedule(undefined, targetTime - now);
        return;
      }
      emit(id);
    }

    source.subscribe(new OperatorSubscriber(
      subscriber,
      (value, id) => {
        lastValue = value;
        lastTime = scheduler.now();
        if (!activeTask) {
          activeTask = scheduler.schedule(
            (function () {
              return function () {
                emitWhenIdle(id);
              };
            }(id)),
            dueTime,
          );
        }
      },
      () => {
        emit();
        subscriber.complete();
      },
      undefined,
      () => {
        lastValue = null;
        activeTask = null;
      },
    ));
  });
}
