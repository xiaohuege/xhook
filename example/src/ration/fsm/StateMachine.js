import _ from 'underscore';
import { INIT_EVENT } from './config';

// 指令分隔符
const DIRECTIVE_SPLIT = ':';
// 动态索引标识符
const DYNAMIC_INDEX = '$index';

function toArray(item) {
  return _.isUndefined(item) ? [] : [].concat(item);
}

function handleActions(actions, context, event, eventData) {
  const copyContext = Object.assign({}, context);
  let newContext = {};
  let assigned = false;
  const nonAssignActions = [];

  _.each(actions, (action) => {
    const tmpContext = Object.assign({}, newContext);
    if (_.isFunction(action)) {
      nonAssignActions.push(action);
    } else if (_.isObject(action)) {
      const keys = Object.keys(action);
      if (keys.length > 0) {
        assigned = true;
      }
      keys.forEach((tmpKey) => {
        let key = tmpKey;
        let hasDirect = false;
        if (tmpKey.indexOf(DIRECTIVE_SPLIT) > 0) {
          key = tmpKey.split(DIRECTIVE_SPLIT)[0];
          hasDirect = true;
        }
        if (_.isUndefined(action[key])) {
          action[key] = ({ detail }) => {
            // 判断是否包含动态索引，如list[$index].name
            const idx = key.indexOf(DYNAMIC_INDEX);
            if (idx > 0) {
              // 索引前字符串，如list[
              const prevStr = key.slice(0, idx);
              // 索引后字符串，如].name
              const tailStr = key.slice(idx + DYNAMIC_INDEX.length);
              _.each(detail, (pVal, pKey) => {
                const tmpKey = parseInt(pKey.replace(prevStr, '').replace(tailStr, ''), 10);
                if (tmpKey >= 0) {
                  // 命中动态索引，如list[2].name = 'xxxxx'
                  const newKey = `${prevStr}${tmpKey}${tailStr}`;
                  tmpContext[newKey] = pVal;
                }
              });
            }
            return detail[key];
          };
        }
        tmpContext[key] = _.isFunction(action[key])
          ? action[key]({ context: copyContext, event, detail: eventData })
          : action[key];
        if (hasDirect) {
          tmpContext[tmpKey] = tmpContext[key];
        }
      });
    }
    newContext = tmpContext;
    // 合并数据到context副本
    // 确保下一个action拿到最新的context
    Object.assign(copyContext, newContext);
  });

  return [nonAssignActions, newContext, assigned];
}

function createUnchangedState(value) {
  return {
    value,
    context: null,
    changed: false,
  };
}

export default class StateMachine {
  constructor(config, stateRef) {
    this.config = config;
    this.stateRef = stateRef;
    const [initialActions] = handleActions([config.states[config.initial].entry], this.stateRef.current, INIT_EVENT);
    this.initialState = {
      value: config.initial,
      actions: initialActions,
      context: null,
      changed: false,
    };
  }

  transition(state, event, eventData) {
    const { config } = this;
    const { value } = _.isString(state) ? { value: state } : state;
    const stateConfig = config.states[value];
    if (!stateConfig) {
      throw new Error(`State '${value}' not found on machine ${config.id || ''}`);
    }
    if (stateConfig.on && stateConfig.on[event]) {
      const transitionConfig = stateConfig.on[event];
      const { target, actions } = _.isString(transitionConfig) ? { target: transitionConfig } : transitionConfig;
      const isTargetless = target === undefined;
      const nextStateValue = target || value;
      const nextStateConfig = config.states[nextStateValue];
      if (!nextStateConfig) {
        throw new Error(`State '${nextStateValue}' not found on machine ${config.id || ''}`);
      }
      const allActions = isTargetless
        ? toArray(actions)
        : [].concat(stateConfig.exit, actions, nextStateConfig.entry).filter(item => item);
      const [nonAssignActions, nextContext, assigned] = handleActions(
        allActions,
        this.stateRef.current,
        event,
        eventData,
      );
      return {
        value: nextStateValue,
        actions: nonAssignActions,
        context: nextContext,
        changed: target !== value || assigned,
      };
    }
    return createUnchangedState(value);
  }

  dispose() {
    this.stateRef = null;
  }
}
