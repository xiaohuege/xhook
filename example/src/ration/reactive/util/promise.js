import _ from 'underscore';
export function isPromise(obj) {
  return obj && _.isFunction(obj.then);
}

/**
 * promise包裹try-catch
 * @param {Promise} promise
 */
export function catchPromise(promise) {
  return promise
    .then((data) => {
      let tmpData;
      if (_.isUndefined(data) || data === null) {
        tmpData = null;
      } else {
        tmpData = data;
      }
      return [null, tmpData];
    })
    .catch(err => [{ error: err }, {}]);
}
