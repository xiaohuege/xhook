import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';

export function mapTo(value) {
  return operate((source, subscriber) => {
    source.subscribe(new OperatorSubscriber(subscriber, (oldValue, id) => {
      subscriber.next(value, id);
    }));
  });
}
