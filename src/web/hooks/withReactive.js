import { useEffect, useRef, useMemo, useState } from 'react';
import { Subject } from '../../reactive/Subject';
import { startNewContext, resetContext } from '../PreContext';
import { REF_TAG } from '../contants';
import _ from 'underscore';
import { STATE_KEY } from '../../fsm/config';
import { startMachine } from '../../fsm/index';

// 处理输入参数
function handleProps(props) {
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);
  return propsRef;
}

// 处理资源回收
function handleGc() {
  const gcRef = useRef([]);
  useEffect(
    () => () => {
      if (_.isArray(gcRef.current)) {
        _.each(gcRef.current, (sub) => {
          sub.unsubscribe && sub.unsubscribe();
        });
      }
    },
    [],
  );
  return gcRef;
}

// 处理生命周期
function handleLifecycle(state) {
  // 可观测对象--挂载
  const mountRef = useRef(new Subject());
  // 可观测对象--卸载
  const unmountRef = useRef(new Subject());
  useEffect(() => {
    mountRef.current.next({ data: state, item: null });
    return () => unmountRef.current.next();
  }, []);
  return [mountRef, unmountRef];
}

// 预处理
function preprocess(refMap, fn, props, state) {
  startNewContext(refMap);
  const render = fn(props, state);
  // 重置预处理上下文
  resetContext();
  return render;
}

export function withReactive(fn, stateMachineConfig) {
  return (props) => {
    // 初始状态，如果未传入状态机配置，则默认空对象
    const initState = useMemo(() => {
      let initState = {};
      if (_.isObject(stateMachineConfig) && stateMachineConfig.context && stateMachineConfig.initial) {
        // 启用状态机
        Object.assign(initState, stateMachineConfig.context);
        // 状态追加$state字段，表示状态机当前所处状态
        initState[STATE_KEY] = stateMachineConfig.initial;
      }
      return initState;
    }, []);
    // 初始化组件状态
    // 自身状态
    const stateRef = useRef(initState);
    // 更新状态
    const setStateRef = useRef();
    const [state, setState] = useState(initState);
    useEffect(() => {
      // 状态发生变化
      stateRef.current = state;
      setStateRef.current = setState;
    }, [state]);
    // 启用状态机
    const machineRef = useRef();
    useMemo(() => {
      if (_.isObject(stateMachineConfig) && stateMachineConfig.context && stateMachineConfig.initial) {
        const service = startMachine(stateMachineConfig, stateRef);
        machineRef.current = service;
      }
    }, []);
    // 输入参数
    const propsRef = handleProps(props);
    // 生命周期
    const [mountRef, unmountRef] = handleLifecycle(state);
    // 资源回收
    const gcRef = handleGc();

    // 开启新的预处理上下文
    const refMap = {
      [REF_TAG.props]: propsRef,
      [REF_TAG.state]: stateRef,
      [REF_TAG.mount]: mountRef,
      [REF_TAG.unmount]: unmountRef,
      [REF_TAG.setState]: setStateRef,
      [REF_TAG.gc]: gcRef,
      [REF_TAG.machine]: machineRef,
    };
    return preprocess(refMap, fn, props, state);
  };
}
