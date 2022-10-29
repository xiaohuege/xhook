import { useEffect, useRef, useMemo } from 'react';
import { getCurrentContext } from '../PreContext';
import { Subject } from '../../reactive/Subject';
import _ from 'underscore';
import { REF_TAG } from '../contants';
import { gc } from './gc';

export function useObserver(keys, project, needSubscribe = true) {
  const context = getCurrentContext();
  const stateRef = context[REF_TAG.state];
  const propRef = context[REF_TAG.props];
  const obRef = useRef(new Subject());
  // 依赖项
  const deps = [];
  const props = propRef.current;
  const porpKeys = _.isArray(keys) ? keys : [keys];
  _.each(porpKeys, (key) => {
    deps.push(props[key]);
  });
  const newOb$ = useMemo(() => {
    let ob$ = obRef.current;
    if (_.isFunction(project)) {
      ob$ = project(ob$);
    }
    needSubscribe && gc(ob$);
    return ob$;
  }, []);
  useEffect(() => {
    const props = propRef.current;
    const newVals = [];
    _.each(porpKeys, (key) => {
      newVals.push(props[key]);
    });
    newOb$.next({ data: stateRef.current, item: newVals });
  }, deps);
  return [newOb$, obRef.current];
}
