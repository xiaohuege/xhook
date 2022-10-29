import { useRef, useMemo } from 'react';
import { Subject } from '../../reactive/Subject';
import { getCurrentContext } from '../PreContext';
import { REF_TAG } from '../contants';
import _ from 'underscore';
import { gc } from './gc';

/**
 * 事件监听hook--自定义dom监听
 * @param {*} handler dom事件监听
 * @param {*} project 处理流程
 * @param {*} needSubscribe 是否订阅，默认true
 * @returns [事件处理函数，新可观测对象，源可观测对象]
 */
export function useDomEventListen(handler ,project, needSubscribe = true) {
  const context = getCurrentContext();
  const stateRef = context[REF_TAG.state];
  const obRef = useRef(new Subject());
  const newOb$ = useMemo(() => {
    if (!_.isFunction(handler)) {
      throw new Error('[handler] must be Function');
    }
    let ob$ = obRef.current;
    if (_.isFunction(project)) {
      ob$ = project(ob$);
    }
    needSubscribe && gc(ob$);
    // 执行dom监听
    handler(item => ob$.next({ data: stateRef.current, item }));
    return ob$;
  }, []);
  return [newOb$, obRef.current];
}
