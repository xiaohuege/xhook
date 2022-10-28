import { operate } from '../util/lift';

export function subscribeOn(scheduler, delay) {
  return operate((source, subscriber) => {
    subscriber.add(scheduler.schedule(() => source.subscribe(subscriber), delay));
  });
}
