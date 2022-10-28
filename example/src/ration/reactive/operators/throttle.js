import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';
import { innerFrom } from '../observable/from';

export const defaultThrottleConfig = {
  leading: true,
  trailing: false,
};

export function throttle(durationSelector, { leading, trailing } = defaultThrottleConfig) {
  return operate((source, subscriber) => {
    let hasValue = false;
    let sendValue = null;
    let sendId = null;
    let throttled = null;
    let isComplete = false;

    const endThrottling = () => {
      if (throttled) {
        throttled.unsubscribe();
      }
      throttled = null;
      if (trailing) {
        send();
        isComplete && subscriber.complete();
      }
    };

    const cleanupThrottling = () => {
      throttled = null;
      isComplete && subscriber.complete();
    };

    const startThrottle = value => (throttled = innerFrom(durationSelector(value)).subscribe(new OperatorSubscriber(subscriber, endThrottling, cleanupThrottling)));

    const send = () => {
      if (hasValue) {
        hasValue = false;
        const value = sendValue;
        sendValue = null;
        subscriber.next(value, sendId);
        !isComplete && startThrottle(value);
      }
    };

    source.subscribe(new OperatorSubscriber(
      subscriber,
      (value, id) => {
        hasValue = true;
        sendValue = value;
        sendId = id;
        !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
      },
      () => {
        isComplete = true;
        !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
      },
    ));
  });
}
