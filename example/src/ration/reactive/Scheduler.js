import { getCurrentTimestamp } from './util/time';

export class Scheduler {
  static now = () => getCurrentTimestamp();

  constructor(schedulerActionCtor, _now = Scheduler.now) {
    this.schedulerActionCtor = schedulerActionCtor;
    this.now = _now;
  }

  now() {
    return this._now();
  }

  schedule(work, delay = 0, state = null) {
    return new this.schedulerActionCtor(this, work).schedule(state, delay);
  }
}
