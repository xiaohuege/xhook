import { getCurrentContext } from '../PreContext';
import { REF_TAG } from '../contants';

export function gc(ob$) {
  const ctx = getCurrentContext();
  const gcRef = ctx[REF_TAG.gc].current;
  if (!ob$) return;
  const subscription = ob$.subscribe();
  gcRef.push(subscription);
}
