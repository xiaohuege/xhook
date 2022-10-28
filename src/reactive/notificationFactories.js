/**
 * 创建通知对象
 * @param {*} kind 类型 N:next E:error C:complete
 * @param {*} value
 * @param {*} error
 * @returns
 */
export function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error,
  };
}

export const COMPLETE_NOTIFICATION = (() => createNotification('C'))();

export function errorNotification(err) {
  return createNotification('E', undefined, err);
}

export function nextNotification(value) {
  return createNotification('N', value);
}
