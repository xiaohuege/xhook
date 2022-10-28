import { Action } from './Action';
import { intervalProvider } from './timerProvider';

export class AsyncAction extends Action {
  id = null;
  state = null;
  delay = null;
  pending = false;

  schedule(state, delay = 0) {
    if (this.closed) {
      return this;
    }
    this.state = state;
    const { id, scheduler } = this;
    if (id !== null) {
      this.id = this.recycleAsyncId(id, delay);
    }
    this.pending = true;
    this.delay = delay;
    this.id = this.id || this.requestAsyncId(scheduler, delay);
    return this;
  }

  recycleAsyncId(id, delay = 0) {
    if (delay !== null && this.delay === delay && this.pending === false) {
      return id;
    }
    intervalProvider.clearInterval(id);
    return null;
  }

  requestAsyncId(scheduler, delay = 0) {
    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
  }

  execute(state) {
    if (this.closed) {
      return new Error('正在执行已经取消的行动');
    }
    this.pending = false;
    const error = this.executeAction(state);
    if (error) {
      return error;
    }
    if (this.pending === false && this.id !== null) {
      this.id = this.recycleAsyncId(this.id, null);
    }
  }

  executeAction(state) {
    let errored = false;
    let errorValue;
    try {
      this.work(state);
    } catch (err) {
      errored = true;
      errorValue = (!!err && err) || new Error(err);
    }
    if (errored) {
      this.unsubscribe();
    }
    return errorValue;
  }

  unsubscribe() {
    if (!this.closed) {
      const { id, scheduler } = this;
      const { actions = [] } = scheduler || {};

      this.work = null;
      this.state = null;
      this.scheduler = null;
      this.pending = false;

      const idx = actions.indexOf(this);
      if (idx >= 0) {
        actions.splice(idx, 1);
      }
      if (id !== null) {
        this.id = this.recycleAsyncId(id, null);
      }

      this.delay = null;
      super.unsubscribe();
    }
  }
}
