import { fromBranch } from '../observable/from';
import { operate } from '../util/lift';
import { OperatorSubscriber } from './OperatorSubscriber';
import { isObservable } from '../Observable';
import _ from 'underscore';
import { pipe } from '../util/pipe';
import { filter } from './filter';

/**
 * 分支操作符，用于开启旁支流程且其结果不影响主流程
 * @param {*} project 用于生成旁支流程
 * @param {*} operator 用于生成旁支流程使用的操作符
 */
function branchFilter(project, operator) {
  return operate((source, subscriber) => {
    source.subscribe(new OperatorSubscriber(subscriber, (value, id) => {
      if (_.isFunction(operator)) {
        let ob = _.isFunction(project) ? project(value, id) : null;
        if (isObservable(ob)) {
          ob = ob.pipe(operator);
          ob.subscribe();
        }
      } else {
        console.warn('**operator is not function**');
      }
      subscriber.next(value, id);
    }));
  });
}

/**
 * 分支操作符，用于开启旁支流程且其结果不影响主流程
 * 只有一个参数时认为传的是操作符且不做过滤
 * @param {*} filterSelector 返回true时生成新的分支
 * @param {*} operator 用于生成旁支流程使用的操作符
 */
export function branch(filterSelector, operator) {
  const noFilter = _.isUndefined(operator);
  if (noFilter) {
    operator = filterSelector;
    filterSelector = () => true;
  }
  const lines = [
    branchFilter(
      (item, id) => (_.isFunction(filterSelector) && filterSelector(item) ? fromBranch(id, item) : null),
      operator,
    ),
  ];
  if (!noFilter) {
    lines.push(filter(item => !_.isFunction(filterSelector) || !filterSelector(item)));
  }
  return pipe(...lines);
}
