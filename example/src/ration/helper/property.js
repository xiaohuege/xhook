import _ from 'underscore';

/**
 * 读取多层级属性
 * @param {*} ctx
 * @param {*} path
 * @param {*} defaultVal
 */
export function getMutliLevelProperty(ctx, path, defaultVal) {
  let res = defaultVal;
  if (!_.isString(path) || !_.isObject(ctx)) return res;
  let key = path.replace(/\[(\w+)\]/g, '.$1');
  key = key.replace(/^\./, '');
  let arr = key.split('.');
  for (let i = 0, count = arr.length; i < count; i++) {
    let p = arr[i];
    if ((_.isObject(ctx) || _.isArray(ctx)) && p in ctx) {
      ctx = ctx[p];
    } else {
      return res;
    }
  }
  res = ctx;
  return res;
}

/**
 * 设置多层级属性
 * @param {*} ctx
 * @param {*} path
 * @param {*} val
 */
export function setMutliLevelProperty(ctx, path, val) {
  if (!_.isString(path) || !_.isObject(ctx)) return;
  let key = path.replace(/\[(\w+)\]/g, '.$1');
  key = key.replace(/^\./, '');
  let arr = key.split('.');
  for (let i = 0, count = arr.length; i < count; i++) {
    let p = arr[i];
    if (p in ctx) {
      if (i === count - 1) {
        ctx[p] = val;
      } else {
        ctx = ctx[p];
      }
    } else {
      return;
    }
  }
}
