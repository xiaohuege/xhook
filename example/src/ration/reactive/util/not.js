export function not(pred, thisArg) {
  return (value, index) => !pred.call(thisArg, value, index);
}
