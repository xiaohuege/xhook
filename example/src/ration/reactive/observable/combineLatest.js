import { Observable } from '../Observable';
import { argsArgArrayOrObject } from '../util/argsArgArrayOrObject';
import { from } from './from';
import { identity } from '../util/identity';
import { mapOneOrManyArgs } from '../util/mapOneOrManyArgs';
import { popResultSelector, popScheduler } from '../util/args';
import { createObject } from '../util/createObject';
import { OperatorSubscriber } from '../operators/OperatorSubscriber';

export function combineAllLatest(...args) {
  const scheduler = popScheduler(args);
  const resultSelector = popResultSelector(args);

  const { args: observables, keys } = argsArgArrayOrObject(args);

  if (observables.length === 0) {
    return from([], scheduler);
  }

  const result = new Observable(combineLatestInit(observables, scheduler, keys ? values => createObject(keys, values) : identity));

  return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}

export function combineLatestInit(observables, scheduler, valueTransform = identity) {
  return (subscriber) => {
    maybeSchedule(
      scheduler,
      () => {
        const { length } = observables;
        const values = new Array(length);
        let active = length;
        let remainingFirstValues = length;
        for (let i = 0; i < length; i++) {
          maybeSchedule(
            scheduler,
            () => {
              const source = from(observables[i], scheduler);
              let hasFirstValue = false;
              source.subscribe(new OperatorSubscriber(
                subscriber,
                (value, id) => {
                  values[i] = value;
                  if (!hasFirstValue) {
                    hasFirstValue = true;
                    remainingFirstValues = remainingFirstValues - 1;
                  }
                  if (!remainingFirstValues) {
                    subscriber.next(valueTransform(values.slice()), id);
                  }
                },
                () => {
                  active = active - 1;
                  if (!active) {
                    subscriber.complete();
                  }
                },
              ));
            },
            subscriber,
          );
        }
      },
      subscriber,
    );
  };
}

function maybeSchedule(scheduler, execute, subscription) {
  if (scheduler) {
    subscription.add(scheduler.schedule(execute));
  } else {
    execute();
  }
}
