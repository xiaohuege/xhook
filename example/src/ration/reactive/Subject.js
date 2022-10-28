import { Observable } from './Observable';
import { Subscription, EMPTY_SUBSCRIPTION } from './Subscription';
import { arrRemove } from './util/arrRemove';

function createUnsubscribedError() {
  const err = new Error();
  err.name = 'ObjectUnsubscribedError';
  err.message = 'object unsubscribed';
  return err;
}

export class Subject extends Observable {
  observers = [];

  closed = false;

  isStopped = false;

  hasError = false;

  thrownError = null;

  lift(operator) {
    const subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  }

  _throwIfClosed() {
    if (this.closed) {
      throw createUnsubscribedError();
    }
  }

  next(value, id) {
    this._throwIfClosed();
    if (!this.isStopped) {
      const copy = this.observers.slice();
      for (const observer of copy) {
        observer.next(value, id);
      }
    }
  }

  error(err) {
    this._throwIfClosed();
    if (!this.isStopped) {
      this.hasError = true;
      this.isStopped = true;
      this.thrownError = err;
      const { observers } = this;
      while (observers.length) {
        const tmpObserver = observers.shift();
        if (tmpObserver) {
          tmpObserver.error(err);
        }
      }
    }
  }

  complete() {
    this._throwIfClosed();
    if (!this.isStopped) {
      this.isStopped = true;
      const { observers } = this;
      while (observers.length) {
        const tmpObserver = observers.shift();
        if (tmpObserver) {
          tmpObserver.complete();
        }
      }
    }
  }

  unsubscribe() {
    this.isStopped = true;
    this.closed = true;
    this.observers = null;
  }

  _trySubscribe(subscriber) {
    this._throwIfClosed();
    return super._trySubscribe(subscriber);
  }

  _subscribe(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  }

  _innerSubscribe(subscriber) {
    const { hasError, isStopped, observers } = this;
    return hasError || isStopped
      ? EMPTY_SUBSCRIPTION
      : (observers.push(subscriber), new Subscription(() => arrRemove(this.observers, subscriber)));
  }

  _checkFinalizedStatuses(subscriber) {
    const { hasError, thrownError, isStopped } = this;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  }

  asObservable() {
    const observable = new Observable();
    observable.source = this;
    return observable;
  }
}

export class AnonymousSubject extends Subject {
  constructor(destination, source) {
    super();
    this.destination = destination;
    this.source = source;
  }

  next(value, id) {
    if (this.destination && this.destination.next) {
      this.destination.next(value, id);
    }
  }

  error(err) {
    if (this.destination && this.destination.error) {
      this.destination.error(err);
    }
  }

  complete() {
    if (this.destination && this.destination.complete) {
      this.destination.complete();
    }
  }
}
