import { useRef, useMemo } from 'react';
import { Subject } from '../../reactive/Subject';
import { getCurrentContext } from '../PreContext';
import { REF_TAG } from '../contants';
import _ from 'underscore';
import { gc } from './gc';
import { useCustomEventListen } from './useCustomEventListen';

/**
 * 事件监听hook--自定义dom监听
 * @param {*} target dom对象
 * @param {*} eventName 时间名称
 * @param {*} project 处理流程
 * @param {*} needSubscribe 是否订阅，默认true
 * @returns [事件处理函数，新可观测对象，源可观测对象]
 */
export function useDomEventListen(target, eventName, project, needSubscribe = true) {
  return useCustomEventListen((next) => {
    const handler = (e) => {
      next(e);
    }
    target.addEventListener(eventName, handler);
    return () => target.removeEventListener(eventName, handler);
  }, project, needSubscribe);
}
