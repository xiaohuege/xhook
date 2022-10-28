import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';
import { identity } from '../util/identity';

export function retry(configOrCount) {
  let config;
  if (configOrCount && typeof configOrCount === 'object') {
    config = configOrCount;
  } else {
    config = {
      count: configOrCount,
    };
  }
  const { count, resetOnSuccess = false } = config;

  return count <= 0
    ? identity
    : operate((source, subscriber) => {
      let soFar = 0;
      let innerSub;
      const subscribeForRetry = () => {
        let syncUnsub = false;
        innerSub = source.subscribe(new OperatorSubscriber(
          subscriber,
          (value, id) => {
            if (resetOnSuccess) {
              soFar = 0;
            }
            subscriber.next(value, id);
          },
          undefined,
          (err) => {
            if (soFar < count) {
              if (innerSub) {
                innerSub.unsubscribe();
                innerSub = null;
                subscribeForRetry();
              } else {
                syncUnsub = true;
              }
            } else {
              subscriber.error(err);
            }
            soFar += 1;
          },
        ));
        if (syncUnsub) {
          innerSub.unsubscribe();
          innerSub = null;
          subscribeForRetry();
        }
      };
      subscribeForRetry();
    });
}
