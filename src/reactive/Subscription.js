import _ from 'underscore';

/**
 * 执行资源释放
 * @param {*} dispose 函数或者Subscription对象
 */
function execDispose(dispose) {
  if (_.isFunction(dispose)) {
    dispose();
  } else if (dispose && _.isFunction(dispose.unsubscribe)) {
    dispose.unsubscribe();
  }
}

export class Subscription {
  static EMPTY = (() => {
    const empty = new Subscription();
    empty.closed = true;
    return empty;
  })();

  // 是否已经取消订阅
  closed = false;
  // 父节点
  _parents = [];
  // 回收函数列表
  _disposeFuncs = [];
  constructor(initDispose) {
    this.initDispose = initDispose;
  }

  /**
   * 取消订阅，释放资源
   */
  unsubscribe() {
    let errors;
    if (!this.closed) {
      this.closed = true;
      const { _parents, initDispose, _disposeFuncs } = this;
      _.each(_parents, (p) => {
        p.remove(this);
      });
      if (_.isFunction(initDispose)) {
        try {
          initDispose();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      _.each(_disposeFuncs, (df) => {
        try {
          execDispose(df);
        } catch (err) {
          errors = errors || [];
          if (err instanceof UnsubscriptionError) {
            errors = [...errors, ...err.errors];
          } else {
            errors.push(err);
          }
        }
      });
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  }

  dispose() {
    this.unsubscribe();
  }

  /**
   * 添加取消订阅处理
   * @param {*} dispose
   */
  add(dispose) {
    if (dispose && dispose !== this) {
      if (this.closed) {
        execDispose(dispose);
      } else {
        if (dispose instanceof Subscription) {
          if (dispose.closed || dispose._isParent(this)) return;
          dispose._addParent(this);
        }
        this._disposeFuncs.push(dispose);
      }
    }
  }

  /**
   * 添加父节点
   * @param {Subscription} parent 父节点
   */
  _addParent(parent) {
    this._parents.push(parent);
  }

  /**
   * 判断是否父节点
   * @param {Subscription} parent 父节点
   * @returns {boolean}
   */
  _isParent(parent) {
    return this._parents.includes(parent);
  }

  /**
   * 删除父节点
   * @param {Subscription} parent 父节点
   * @returns
   */
  _removeParent(parent) {
    const idx = this._parents.indexOf(parent);
    if (idx >= 0) {
      this._parents.splice(idx, 1);
    }
  }

  /**
   * 移除取消订阅处理
   * @param {*} dispose
   */
  remove(dispose) {
    const idx = this._disposeFuncs.indexOf(dispose);
    if (idx >= 0) {
      this._disposeFuncs.splice(idx, 1);
    }
    if (dispose instanceof Subscription) {
      dispose._removeParent(this);
    }
  }
}

export const EMPTY_SUBSCRIPTION = Subscription.EMPTY;

/**
 * 是否是订阅对象
 * @param {*} value
 * @returns
 */
export function isSubscription(obj) {
  let res = false;
  if (_.isObject(obj)) {
    if (obj instanceof Subscription) {
      res = true;
    } else if ('closed' in obj && _.isFunction(obj.add) && _.isFunction(obj.remove) && _.isFunction(obj.unsubscribe)) {
      res = true;
    }
  }
  return res;
}

export class UnsubscriptionError extends Error {
  errors = [];
}
