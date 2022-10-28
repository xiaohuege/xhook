import { operate } from '../../reactive/util/lift';
import { OperatorSubscriber } from '../../reactive/operators/OperatorSubscriber';
import _ from 'underscore';
import { getCurrentContext } from '../PreContext';
import { REF_TAG } from '../contants';

/**
 * 更新状态
 * @param {*} resultSelector 用于生成返回的结果
 */
export function update(resultSelector) {
  const context = getCurrentContext();
  const stateRef = context[REF_TAG.state];
  const setStateRef = context[REF_TAG.setState];
  return operate((source, subscriber) => {
    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
      let newData = value;
      if (_.isFunction(resultSelector)) {
        newData = resultSelector(stateRef.current, value);
      }
      const state = Object.assign({}, stateRef.current, newData);
      const setState = setStateRef.current;
      if (setState) {
        setState(state);
      }
      subscriber.next(newData);
    }));
  });
}
