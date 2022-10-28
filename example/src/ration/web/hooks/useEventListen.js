import { useCallback, useRef, useMemo } from 'react';
import { Subject } from '../../reactive/Subject';
import { getCurrentContext } from '../PreContext';
import { REF_TAG } from '../contants';
import _ from 'underscore';
import { useGc } from './gc';

/**
 * 事件监听hook
 * @param {*} project 处理流程
 * @param {*} needSubscribe 是否订阅，默认true
 * @returns [事件处理函数，新可观测对象，源可观测对象]
 */
export function useEventListen(project, needSubscribe = true) {
  const context = getCurrentContext();
  const stateRef = context[REF_TAG.state];
  const obRef = useRef(new Subject());
  const oriOb$ = obRef.current;
  const newOb$ = useMemo(() => {
    let ob$ = obRef.current;
    if (_.isFunction(project)) {
      ob$ = project(ob$);
    }
    needSubscribe && useGc(ob$);
    return ob$;
  }, []);
  const eventHandler = useCallback((...args) => {
    newOb$.next({ data: stateRef.current, item: args });
  }, []);
  return [eventHandler, newOb$, oriOb$];
}
