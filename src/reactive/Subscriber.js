import _ from 'underscore';
import { Subscription, isSubscription } from './Subscription';
import { Observer } from './Observer';
import { defaultErrorHandler } from './util/error';
import { nextNotification, errorNotification, COMPLETE_NOTIFICATION } from './notificationFactories';

export class Subscriber extends Subscription {
  isStopped = false;
  destination = null;

  static create(observerOrNext, error, complete) {
    return new SafeSubscriber(observerOrNext, error, complete);
  }

  constructor(destination) {
    super();
    if (destination) {
      this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(this);
      }
    } else {
      this.destination = EMPTY_OBSERVER;
    }
  }

  next(value, id) {
    if (!this.isStopped) {
      this._next(value, id);
    } else {
      handleStoppedNotification(nextNotification(value), this);
    }
  }

  error(err) {
    if (!this.isStopped) {
      this.isStopped = true;
      this._error(err);
    } else {
      handleStoppedNotification(errorNotification(err), this);
    }
  }

  complete() {
    if (!this.isStopped) {
      this.isStopped = true;
      this._complete();
    } else {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    }
  }

  unsubscribe() {
    if (!this.closed) {
      this.isStopped = true;
      super.unsubscribe();
      this.destination = null;
    }
  }

  _next(value, id) {
    this.destination.next(value, id);
  }

  _error(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  }

  _complete() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }
}

function handleStoppedNotification(notification, subscriber) {
  console.error('handleStoppedNotification', notification, subscriber);
  if (notification && notification.error && notification.error.stack) {
    console.error(notification.error.stack);
  }
}

export class SafeSubscriber extends Subscriber {
  constructor(observerOrNext, error, complete) {
    super();
    this.destination = new Observer(observerOrNext, error, complete, this);
  }
}

export const EMPTY_OBSERVER = {
  closed: true,
  next: _.noop,
  error: defaultErrorHandler,
  complete: _.noop,
};
