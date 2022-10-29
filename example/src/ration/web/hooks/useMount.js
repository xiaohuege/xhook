import { getCurrentContext } from '../PreContext';
import { REF_TAG } from '../contants';
import _ from 'underscore';
import { gc } from './gc';
import { useMemo } from 'react';

/**
 * 挂载事件监听hook
 * @param {*} project 处理流程
 * @param {*} needSubscribe 是否订阅，默认true
 * @returns [新可观测对象，源可观测对象]
 */
export function useMount(project, needSubscribe = true) {
  const ctx = getCurrentContext();
  const mount$ = ctx[REF_TAG.mount];
  const newOb$ = useMemo(() => {
    let ob$ = mount$.current;
    if (_.isFunction(project)) {
      ob$ = project(ob$);
    }
    needSubscribe && gc(ob$);
    return ob$;
  }, []);
  return [newOb$, mount$.current];
}

/**
 * 卸载事件监听hook
 * @param {*} project 处理流程
 * @param {*} needSubscribe 是否订阅，默认true
 * @returns [新可观测对象，源可观测对象]
 */
export function useUnmount(project, needSubscribe = true) {
  const ctx = getCurrentContext();
  const unmount$ = ctx[REF_TAG.unmount];
  const newOb$ = useMemo(() => {
    let ob$ = unmount$.current;
    if (_.isFunction(project)) {
      ob$ = project(ob$);
    }
    needSubscribe && gc(ob$);
    return ob$;
  }, []);
  return [newOb$, unmount$.current];
}
