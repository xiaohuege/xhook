import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';
import { innerFrom } from '../observable/from';
import _ from 'underscore';

export function takeUntil(notifier) {
  return operate((source, subscriber) => {
    innerFrom(notifier).subscribe(new OperatorSubscriber(subscriber, () => subscriber.complete(), _.noop));
    !subscriber.closed && source.subscribe(subscriber);
  });
}
