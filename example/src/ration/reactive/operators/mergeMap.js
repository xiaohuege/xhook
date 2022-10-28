import { map } from './map';
import { innerFrom } from '../observable/from';
import { operate } from '../util/lift';
import { mergeInternals } from './mergeInternals';
import _ from 'underscore';

export function mergeMap(project, resultSelector, concurrent = Infinity) {
  if (_.isFunction(resultSelector)) {
    return mergeMap((a, i) => map((b, ii) => resultSelector(a, b, i, ii))(innerFrom(project(a, i))), concurrent);
  }
  if (typeof resultSelector === 'number') {
    concurrent = resultSelector;
  }

  return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent));
}
