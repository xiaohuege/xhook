/* 首页：全部审核单页面 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withReactive, useMount, useEventListen, useEventCompose, useUnmount, useObserver } from '../../ration/web';
import { map, merge, log, scan, update, transition, timer, switchMap, takeUntil } from '../../ration/main';

import './index.css';

const Count = withReactive((props, state) => {
  const [addoneHandler, addone$] = useEventListen(ob$ => ob$.pipe(map(() => 1)), false);

  const [addtowHandler, addtwo$] = useEventListen(ob$ => ob$.pipe(map(() => 2)), false);

  const [addthreeHandler, addthree$] = useEventListen(ob$ => ob$.pipe(map(({ item }) => item[1])), false);

  useEventCompose(() => addone$.pipe(
    merge(addtwo$, addthree$),
    scan((prev, cur) => prev + cur, 0),
    update((data, total) => ({ total })),
  ));

  const num = props.num || 3;
  return (
    <div className="child">
      <div className="title">
        {props.tag}:{state.total}
      </div>
      <div className="btn-group">
        <button onClick={addoneHandler}>+1</button>
        <button onClick={addtowHandler}>+2</button>
        <button onClick={e => addthreeHandler(e, num)}>
          {num > 0 ? '+' : ''}
          {num}
        </button>
      </div>
    </div>
  );
});

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

function calcTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const timeStr = `${year}-${month + 1}-${day} ${hour}:${minute}:${second}`;
  return { time: +now, timeStr };
}

const Clock = withReactive((props, state) => {
  const [, unmount$] = useUnmount();
  useMount(ob$ => ob$.pipe(
    transition('INIT'),
    switchMap(() => timer(3000)),
    transition('DONE'),
    switchMap(() => timer(0, 1000)),
    map(() => calcTime()),
    transition('LOOP'),
    takeUntil(unmount$),
  ));

  useObserver('flag', ob$ => ob$.pipe(log(6666666), transition('FLAG', ({item}) => ({flag: item[0]}))));
  const { title, timeStr, $state, flag } = state;
  return (
    <div className="clock">
      <div className="clock-title">[flag:{flag}]{title}</div>
      <div className="clock-wrap">
        {$state == 'loading' && <div className="clock-loading">努力加载中......</div>}
        {$state != 'loading' && <div className="clock-time">{timeStr}</div>}
      </div>
    </div>
  );
}, ClockStateMachine);

const Rx = withReactive((props, state) => {
  const title = 'withReactive测试';
  const [, unmount$] = useUnmount();
  useMount(ob$ => ob$.pipe(log('rx mount'), switchMap(() => timer(2000, 1000)), update((data, flag) => ({ flag })), log('rx mount 2222'), takeUntil(unmount$)));
  return (
    <div>
      <div className="nav-title">{title}</div>
      <Count tag="1-总数" />
      <Count tag="2-总数" num={6} />
      <Count tag="3-总数" num={-8} />
      <Clock flag={state.flag}/>
    </div>
  );
});

export default withRouter(Rx);
