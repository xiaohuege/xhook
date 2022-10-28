import { interpret } from './interpret';
import StateMachine from './StateMachine';

/**
 * 启动状态机
 * @param {*} fsmConfig 状态机配置
 * @param {*} stateRef 状态ref
 */
export function startMachine(fsmConfig, stateRef) {
  const machine = new StateMachine(fsmConfig, stateRef);
  const service = interpret(machine, stateRef);
  service.start();
  return service;
}
