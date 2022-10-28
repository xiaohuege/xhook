import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';

export function map(func, thisArg) {
  return operate((source, subscriber) => {
    let index = 0;
    source.subscribe(new OperatorSubscriber(subscriber, (value, id) => {
      subscriber.next(func.call(thisArg, value, index), id);
      index += 1;
    }));
  });
}
