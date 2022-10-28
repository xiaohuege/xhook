import { tap } from '../../reactive/operators/tap';

/**
 * 记录log
 * 最后一个参数指定console的类型：log|error|warn|info等
 */
export function log(...args) {
  return tap((value) => {
    const params = [...args];
    let func = console.log;
    if (params.length) {
      const funcName = params.pop();
      if (console[funcName]) {
        func = console[funcName];
      } else {
        params.push(funcName);
      }
    }
    params.push(value);
    func(...params);
  });
}
