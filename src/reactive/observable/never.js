import { Observable } from '../Observable';
import _ from 'underscore';

export const NEVER = new Observable(_.noop);

export function never() {
  return NEVER;
}
