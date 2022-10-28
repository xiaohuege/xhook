import _ from 'underscore';

export function hasLift(source) {
  return source && _.isFunction(source.lift);
}

export function operate(init) {
  return (source) => {
    if (hasLift(source)) {
      return source.lift(function (liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError('不能提升(lift)非Observable类型');
  };
}
