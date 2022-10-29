import { getCurrentContext } from '../PreContext';
import { REF_TAG } from '../contants';
import { isObservable } from '../../reactive/index';
import _ from 'underscore';

export function gc(ob$) {
  if (!ob$) return;
  const ctx = getCurrentContext();
  const gcRef = ctx[REF_TAG.gc].current;
  if (isObservable(ob$)) {
    const subscription = ob$.subscribe();
    gcRef.push(() => subscription.unsubscribe());
  } else if (_.isFunction(ob$)) {
    gcRef.push(ob$);
  }
}
