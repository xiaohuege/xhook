// 时钟组件状态机配置
const ClockStateMachine = {
  context: {
    title: '',
    time: null,
    timeStr: '',
    loading: false,
    flag: '',
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        INIT: {
          actions: {
            loading: true,
          },
          target: 'loading',
        },
      },
    },
    loading: {
      on: {
        DONE: {
          actions: {
            loading: false,
            title: '我是一个时钟',
          },
          target: 'complete',
        },
      },
    },
    complete: {
      on: {
        LOOP: {
          actions: {
            time: void 0,
            timeStr: void 0,
          },
        },
        FLAG: {
          actions: {
            flag: void 0,
          }
        }
      },
    },
  },
};

export default ClockStateMachine;