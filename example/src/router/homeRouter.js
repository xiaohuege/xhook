import LazyComponent from './LazyComponent';

export const homeRouter = [
  {
    name: 'rx',
    path: '/visiual/home/rx',
    exact: true,
    component: LazyComponent(() => import('../pages/rx/index')),
  },
];
