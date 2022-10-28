import { switchMap } from './switchMap';
import _ from 'underscore';

export function switchMapTo(innerObservable, resultSelector) {
  return _.isFunction(resultSelector)
    ? switchMap(() => innerObservable, resultSelector)
    : switchMap(() => innerObservable);
}
