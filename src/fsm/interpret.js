import _ from 'underscore';
import { INIT_EVENT } from './config';

const InterpreterStatus = {
  NotStarted: 0,
  Running: 1,
  Stopped: 2,
};

function executeStateActions(state, context, event, eventData) {
  const copyContext = Object.assign({}, context);
  _.each(state.actions, (action) => {
    if (_.isFunction(action)) {
      action({ context: copyContext, event, detail: eventData });
    }
  });
}

class InterpretService {
  constructor(machine, stateRef) {
    this.state = machine.initialState;
    this.status = InterpreterStatus.NotStarted;
    this.machine = machine;
    this.stateRef = stateRef;
  }

  start() {
    this.status = InterpreterStatus.Running;
    executeStateActions(this.state, this.stateRef.current, INIT_EVENT);
  }

  stop() {
    this.status = InterpreterStatus.Stopped;
    this.machine.dispose();
    this.machine = null;
    this.stateRef = null;
  }

  send(event, eventData) {
    if (this.status !== InterpreterStatus.Running) return;
    this.state = this.machine.transition(this.state, event, eventData);
    executeStateActions(this.state, this.stateRef.current, event, eventData);
    return this.state;
  }
}

export function interpret(machine, stateRef) {
  return new InterpretService(machine, stateRef);
}
