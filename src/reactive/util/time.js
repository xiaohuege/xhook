export function getCurrentTimestamp() {
  return +new Date();
}

export function isValidDate(value) {
  return value instanceof Date && !isNaN(value);
}
