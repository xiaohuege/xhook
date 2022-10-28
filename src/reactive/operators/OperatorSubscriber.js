import { Subscriber } from '../Subscriber';
import _ from 'underscore';

export class OperatorSubscriber extends Subscriber {
  constructor(destination, onNext, onComplete, onError, onFinalize) {
    super(destination);
    this.type = 'operator';
    this.onFinalize = onFinalize;
    if (onNext) {
      this._next = function (value, id) {
        try {
          onNext(value, id);
        } catch (err) {
          destination.error(err);
        }
      };
    } else {
      this._next = super._next;
    }

    if (onError) {
      this._error = function (e) {
        try {
          onError(e);
        } catch (err) {
          destination.error(err);
        } finally {
          this.unsubscribe();
        }
      };
    }

    if (onComplete) {
      this._complete = function () {
        try {
          onComplete();
        } catch (err) {
          destination.error(err);
        } finally {
          this.unsubscribe();
        }
      };
    }
  }

  unsubscribe() {
    const { closed } = this;
    super.unsubscribe();
    !closed && this.onFinalize?.();
    if (!closed && _.isFunction(this.onFinalize)) {
      this.onFinalize();
    }
  }
}
