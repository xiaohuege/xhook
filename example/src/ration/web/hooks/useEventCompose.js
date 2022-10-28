import { useMemo } from 'react';
import { isObservable } from '../../reactive/index';
import _ from 'underscore';
import { useGc } from './gc';

/**
 * 事件合成hook
 * @param {*} project 处理流程
 * @returns 合并后的新可观测对象
 */
export function useEventCompose(project) {
  return useMemo(() => {
    if (!_.isFunction(project)) {
      throw new Error('[project] must be Function');
    }
    const ob$ = project();
    if (!isObservable(ob$)) {
      throw new Error('[project] return value must be Observable');
    }
    useGc(ob$);
    return ob$;
  }, []);
}
