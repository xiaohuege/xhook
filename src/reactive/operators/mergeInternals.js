import { innerFrom } from '../observable/from';
import { OperatorSubscriber } from './OperatorSubscriber';
import _ from 'underscore';

export function mergeInternals(
  source,
  subscriber,
  project,
  concurrent,
  onBeforeNext,
  expand,
  innerSubScheduler,
  additionalTeardown,
) {
  const buffer = [];
  let active = 0;
  let index = 0;
  let isComplete = false;

  const checkComplete = () => {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };

  const outerNext = (value, id) => (active < concurrent ? doInnerSub(value, id) : buffer.push(value));

  const doInnerSub = (value, id) => {
    expand && subscriber.next(value, id);
    active += 1;
    let innerComplete = false;
    const tmpIndex = index;
    index += 1;
    innerFrom(project(value, tmpIndex)).subscribe(new OperatorSubscriber(
      subscriber,
      (innerValue) => {
        onBeforeNext?.(innerValue, id);

        if (expand) {
          outerNext(innerValue, id);
        } else {
          subscriber.next(innerValue, id);
        }
      },
      () => {
        innerComplete = true;
      },
      undefined,
      () => {
        if (innerComplete) {
          try {
            active -= 1;
            while (buffer.length && active < concurrent) {
              const bufferedValue = buffer.shift();
              innerSubScheduler
                ? subscriber.add(innerSubScheduler.schedule(() => doInnerSub(bufferedValue)))
                : doInnerSub(bufferedValue);
            }
            checkComplete();
          } catch (err) {
            subscriber.error(err);
          }
        }
      },
    ));
  };

  source.subscribe(new OperatorSubscriber(subscriber, outerNext, () => {
    isComplete = true;
    checkComplete();
  }));

  return () => {
    if (_.isFunction(additionalTeardown)) {
      additionalTeardown();
    }
  };
}
