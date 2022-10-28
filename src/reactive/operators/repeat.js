import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';
import { EMPTY } from '../observable/empty';

export function repeat(count = 0) {
  if (count == 0) {
    return () => EMPTY;
  }
  return operate((source, subscriber) => {
    let n = 0;
    let innerSub = null;
    const subscribeForRepeat = () => {
      let syncUnsub = false;
      innerSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, () => {
        n += 1;
        if (n < count) {
          if (innerSub) {
            innerSub.unsubscribe();
            innerSub = null;
            subscribeForRepeat();
          } else {
            syncUnsub = true;
          }
        } else {
          subscriber.complete();
        }
      }));

      if (syncUnsub) {
        innerSub.unsubscribe();
        innerSub = null;
        subscribeForRepeat();
      }
    };
    subscribeForRepeat();
  });
}
