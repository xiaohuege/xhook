# xhook简介
> 为了实现状态管理的约束以及代码逻辑的进一步抽象，基于React hook引入xstate和rxjs分别用于状态管理和逻辑代码组织, 以此规避状态过渡拆分导致的混乱、以及hooks使用过程中的一些心智负担。

[github源码](https://github.com/xiaohuege/xhook)

[示例代码](https://github.com/xiaohuege/xhook/blob/main/example/src/pages/rx/index.js)


## 实现原理
> 核心原理：响应事件 -> 变更状态 -> 响应事件 .... -> 变更状态

借助rxjs数据流的理念，劫持组件事件将其转换为数据流，所有业务逻辑编程对这些数据流变化的响应，通过操作符将业务逻辑进行拆分。

> 事件包括：组件加载、卸载，用户操作事件(点击)，属性变更事件




## 学习资料
[xstate学习资料](https://xstate.js.org/)
[rxjs学习资料](https://rxjs.dev/)