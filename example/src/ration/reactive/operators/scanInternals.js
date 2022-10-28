import { OperatorSubscriber } from './OperatorSubscriber';

export function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
  return (source, subscriber) => {
    let hasState = hasSeed;
    let state = seed;
    let index = 0;
    source.subscribe(new OperatorSubscriber(
      subscriber,
      (value, id) => {
        const i = index;
        index += 1;
        if (hasState) {
          state = accumulator(state, value, i);
        } else {
          hasState = true;
          state = value;
        }
        emitOnNext && subscriber.next(state, id);
      },
      emitBeforeComplete
          && (() => {
            hasState && subscriber.next(state);
            subscriber.complete();
          }),
    ));
  };
}
