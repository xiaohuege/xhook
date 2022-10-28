import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';
import { innerFrom } from '../observable/from';
import _ from 'underscore';

export function skipUntil(notifier) {
  return operate((source, subscriber) => {
    let taking = false;
    const skipSubscriber = new OperatorSubscriber(
      subscriber,
      () => {
        if (skipSubscriber) {
          skipSubscriber.unsubscribe();
        }
        taking = true;
      },
      _.noop,
    );

    innerFrom(notifier).subscribe(skipSubscriber);

    source.subscribe(new OperatorSubscriber(subscriber, (value, id) => taking && subscriber.next(value, id)));
  });
}
