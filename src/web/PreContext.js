let curContext = null;

/**
 * 开启新的预处理上下文
 */
export function startNewContext(preContext) {
  curContext = preContext;
}

/**
 * 获取当前预处理上下文
 */
export function getCurrentContext() {
  return curContext;
}

/**
 * 重置预处理上下文
 */
export function resetContext() {
  curContext = null;
}
