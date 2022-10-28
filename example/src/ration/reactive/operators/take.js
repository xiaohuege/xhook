import { EMPTY } from '../observable/empty';
import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';

export function take(count) {
  if (count <= 0) {
    return () => EMPTY;
  }
  return operate((source, subscriber) => {
    let seen = 0;
    source.subscribe(new OperatorSubscriber(subscriber, (value, id) => {
      seen += 1;
      if (seen <= count) {
        subscriber.next(value, id);
        if (count <= seen) {
          subscriber.complete();
        }
      }
    }));
  });
}
