import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';

export function filter(predicate, thisArg) {
  return operate((source, subscriber) => {
    let index = 0;
    source.subscribe(new OperatorSubscriber(subscriber, (value, id) => {
      predicate.call(thisArg, value, index) && subscriber.next(value, id);
      index += 1;
    }));
  });
}
