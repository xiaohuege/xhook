import { innerFrom } from '../observable/from';
import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';

export function switchMap(project, resultSelector) {
  return operate((source, subscriber) => {
    let innerSubscriber = null;
    let index = 0;
    let isComplete = false;

    const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();

    source.subscribe(new OperatorSubscriber(
      subscriber,
      (value, id) => {
        innerSubscriber && innerSubscriber.unsubscribe();
        let innerIndex = 0;
        const outerIndex = index;
        index += 1;
        innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = new OperatorSubscriber(
          subscriber,
          (innerValue) => {
            subscriber.next(
              resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex) : innerValue,
              id,
            );
            innerIndex += 1;
          },
          () => {
            innerSubscriber = null;
            checkComplete();
          },
        )));
      },
      () => {
        isComplete = true;
        checkComplete();
      },
    ));
  });
}
