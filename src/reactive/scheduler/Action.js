import { Subscription } from '../Subscription';

export class Action extends Subscription {
  constructor(scheduler, work) {
    super();
    this.scheduler = scheduler;
    this.work = work;
  }

  schedule() {
    return this;
  }
}
