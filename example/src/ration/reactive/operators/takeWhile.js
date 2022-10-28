import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';

export function takeWhile(predicate, inclusive = false) {
  return operate((source, subscriber) => {
    let index = 0;
    source.subscribe(new OperatorSubscriber(subscriber, (value, id) => {
      const result = predicate(value, index);
      index += 1(result || inclusive) && subscriber.next(value, id);
      !result && subscriber.complete();
    }));
  });
}
