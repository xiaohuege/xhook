import _ from 'underscore';
import { defaultErrorHandler } from './util/error';

/**
 * 判断给定对象是不是观察者
 * @param {*} obj 判定对象
 * @returns {boolean}
 */
export function isObserver(obj) {
  let res = false;
  if (_.isObject(obj)) {
    if (obj instanceof Observer) {
      res = true;
    } else if (_.isFunction(obj.next) || _.isFunction(obj.error) || _.isFunction(obj.complete)) {
      res = true;
    }
  }
  return res;
}

export function wrapForErrorHandling(handler, context) {
  return (...args) => {
    try {
      handler.call(context, ...args);
    } catch (err) {
      defaultErrorHandler(err);
    }
  };
}

/**
 * 观察者对象
 */
export class Observer {
  constructor(observerOrNext, error, complete, context) {
    if (isObserver(observerOrNext)) {
      error = observerOrNext.error;
      complete = observerOrNext.complete;
      observerOrNext = observerOrNext.next;
    }
    this.next = observerOrNext ? wrapForErrorHandling(observerOrNext, context) : _.noop;
    this.error = wrapForErrorHandling(error || defaultErrorHandler, context);
    this.complete = complete ? wrapForErrorHandling(complete, context) : _.noop;
  }
}
