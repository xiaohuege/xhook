import { SafeSubscriber, Subscriber } from './Subscriber';
import { isSubscription } from './Subscription';
import { pipeFromArray } from './util/pipe';
import { isObserver } from './Observer';

export class Observable {
  source = null;
  operator = null;

  static create(subscribe) {
    return new Observable(subscribe);
  }

  constructor(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  lift(operator) {
    const observable = new Observable();
    observable.source = this;
    observable.operator = operator;
    return observable;
  }

  subscribe(observerOrNext, error, complete) {
    const subscriber = isSubscriber(observerOrNext)
      ? observerOrNext
      : new SafeSubscriber(observerOrNext, error, complete);
    const { source, operator } = this;
    if (operator) {
      subscriber.add(operator.call(subscriber, source));
    } else {
      subscriber.add(this._subscribe(subscriber));
    }
    return subscriber;
  }

  _subscribe(subscriber) {
    return this.source && this.source.subscribe(subscriber);
  }

  pipe(...operations) {
    const pipeFunc = pipeFromArray(operations);
    return operations.length ? pipeFunc(this) : this;
  }

  valueOf() {
    this.subscribe();
    return this;
  }
}

function isSubscriber(value) {
  return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
}

export function isObservable(ob) {
  return ob && ob instanceof Observable;
}
