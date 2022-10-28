import { operate } from '../reactive/util/lift';
import { OperatorSubscriber } from '../reactive/operators/OperatorSubscriber';
import { STATE_KEY } from './config';
import _ from 'underscore';
import { getCurrentContext } from '../web/PreContext';
import { REF_TAG } from '../web/contants';

/**
 * 状态切换
 * @param {*} event 事件名称
 * @param {*} resultSelector
 */
export function transition(event, resultSelector) {
  const context = getCurrentContext();
  const stateRef = context[REF_TAG.state];
  const setStateRef = context[REF_TAG.setState];
  const machineRef = context[REF_TAG.machine];
  return operate((source, subscriber) => {
    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
      if (!machineRef.current) {
        // 未启用状态机
        subscriber.next(value);
        return;
      }
      // 状态机服务
      const fsmService = machineRef.current;
      // 事件名称
      let eventName = event;
      if (_.isFunction(event)) {
        eventName = event(value, stateRef.current);
      }
      // 事件详情
      let eventData = _.isObject(resultSelector) ? resultSelector : value;
      if (_.isFunction(resultSelector)) {
        eventData = resultSelector(value, stateRef.current);
      }
      // 状态机变换之后的新状态
      const changeState = fsmService.send(eventName, eventData);
      // 变更的状态
      const newData = Object.assign({ [STATE_KEY]: changeState.value }, changeState.context);
      // 无属性发生变化，直接下一步
      if (!_.keys(newData).length) {
        subscriber.next(value);
        return;
      }
      const state = Object.assign({}, stateRef.current, newData);
      const setState = setStateRef.current;
      if (setState) {
        setState(state);
      }
      subscriber.next(state);
    }));
  });
}
