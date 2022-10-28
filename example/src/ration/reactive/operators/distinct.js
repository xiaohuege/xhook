import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';
import _ from 'underscore';

export function distinct(keySelector, flushes) {
  return operate((source, subscriber) => {
    const distinctKeys = new Set();
    source.subscribe(new OperatorSubscriber(subscriber, (value, id) => {
      const key = keySelector ? keySelector(value) : value;
      if (!distinctKeys.has(key)) {
        distinctKeys.add(key);
        subscriber.next(value, id);
      }
    }));

    if (flushes) {
      flushes.subscribe(new OperatorSubscriber(subscriber, () => distinctKeys.clear(), _.noop));
    }
  });
}
