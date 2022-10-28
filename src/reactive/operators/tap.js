import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';
import { identity } from '../util/identity';
import _ from 'underscore';

export function tap(observerOrNext, error, complete) {
  let tapObserver = observerOrNext;
  if (_.isFunction(observerOrNext) || error || complete) {
    tapObserver = { next: observerOrNext, error, complete };
  }

  if (!tapObserver) {
    return identity;
  }
  return operate((source, subscriber) => {
    source.subscribe(new OperatorSubscriber(
      subscriber,
      (value, id) => {
        if (_.isFunction(tapObserver.next)) {
          tapObserver.next(value, id);
        }
        subscriber.next(value, id);
      },
      () => {
        if (_.isFunction(tapObserver.complete)) {
          tapObserver.complete();
        }
        subscriber.complete();
      },
      (err) => {
        if (_.isFunction(tapObserver.error)) {
          tapObserver.error(err);
        }
        subscriber.error(err);
      },
    ));
  });
}
