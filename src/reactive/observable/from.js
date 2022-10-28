import { Observable } from '../Observable';
import { isArrayLike } from '../util/array';
import { isPromise } from '../util/promise';

export function from(obj, id) {
  return id ? fromBranch(id, obj) : innerFrom(obj);
}

export function innerFrom(obj) {
  if (obj instanceof Observable) {
    return obj;
  }
  if (obj != null) {
    if (isArrayLike(obj)) {
      return fromArrayLike(obj);
    }
    if (isPromise(obj)) {
      return fromPromise(obj);
    }
  }
  return new TypeError('输入类型错误;支持的类型[Observable,Promise,Array]');
}

export function fromArrayLike(obj) {
  return new Observable((subscriber) => {
    for (let i = 0; i < obj.length && !subscriber.closed; i++) {
      subscriber.next(obj[i]);
    }
    subscriber.complete();
  });
}

export function fromPromise(obj) {
  return new Observable((subscriber) => {
    obj.then(
      (value) => {
        if (!subscriber.closed) {
          subscriber.next(value);
          subscriber.complete();
        }
      },
      (err) => {
        subscriber.error(err);
      },
    );
  });
}

export function fromBranch(id, value) {
  return new Observable((subscriber) => {
    subscriber.next(value, id);
  });
}
