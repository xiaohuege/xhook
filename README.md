# xhook简介
> 为了实现状态管理的约束以及代码逻辑的进一步抽象，基于React hook引入xstate和rxjs分别用于状态管理和逻辑代码组织, 以此规避状态过渡拆分导致的混乱、以及hooks使用过程中的一些心智负担。

[github源码](https://github.com/xiaohuege/xhook)

[示例代码](https://github.com/xiaohuege/xhook/blob/main/example/src/pages/rx/index.js)


## 实现理念和原理
> 核心原理：响应事件 -> 变更状态 -> 响应事件 .... -> 变更状态

借助rxjs数据流的理念，劫持组件事件将其转换为数据流，所有业务逻辑编程对这些数据流变化的响应，通过操作符将业务逻辑进行拆分。

> 事件包括：组件加载、卸载，用户操作事件(点击)，属性变更事件

借助xstate有限状态机的理念，事先声明好可枚举的状态及其变换过程，所有的状态统一管理，避免状态的碎片化。

[状态机配置示例](https://github.com/xiaohuege/xhook/blob/main/example/src/config/clock.js)

## API介绍
*api数量很少，共6个：1个组件包裹函数、6个hook、3个操作符*

### 1、组件包裹函数 - withReactive
> 函数签名：function withReactive(fn: (props: Object, state: Object) => RenderFunction): void

用于包裹组件，其内可以使用响应式编程模式进行开发;
fn的声明与普通函数式组件类似，props表示输入参数，区别是多了第二个参数，表示组件的状态；
示例：
```javascript
const Count = withReactive((props, state) => {
  return <div>{stat.title}</div>
})
```
### 2、生命周期(加载)事件hook - useMount
> 函数签名：
  /**
    * 挂载事件监听hook
    * @param project 处理流程
    * @param needSubscribe 是否订阅，默认true
    * @returns [新可观测对象，源可观测对象]
    */
  function useMount(project: (ob\$: Observable) => Observable, needSubscribe: boolean = true): [newOb\$: Observable, oriOb\$: Observable]
### 3、生命周期(卸载)事件hook - useUnmount
> 函数签名：
  /**
    * 卸载事件监听hook
    * @param project 处理流程
    * @param needSubscribe 是否订阅，默认true
    * @returns [新可观测对象，源可观测对象]
    */
  function useUnmount(project: (ob\$: Observable) => Observable, needSubscribe: boolean = true): [newOb\$: Observable, oriOb\$: Observable]
### 4、用户操作事件hook - useEvenListen
> 函数签名：
  /**
    * 事件监听hook
    * @param project 处理流程
    * @param needSubscribe 是否订阅，默认true
    * @returns [事件处理函数，新可观测对象，源可观测对象]
    */
  function useEvenListen(project: (ob\$: Observable) => Observable, needSubscribe: boolean = true): [eventHandler: Function, newOb\$: Observable, oriOb\$: Observable]
### 5、自定义dom事件监听hook - useDomEvenListen
> 函数签名：
  /**
    * 事件监听hook--自定义dom监听
    * @param handler dom事件监听,返回资源回收处理函数
    * @param project 处理流程
    * @param needSubscribe 是否订阅，默认true
    */
  function useDomEvenListen(handler: (next: (item: any) => void) => Function, project: (ob\$: Observable) => Observable, needSubscribe: boolean = true): [newOb\$: Observable, oriOb\$: Observable]
### 6、属性变更hook - useObserver
> 函数签名：
  /**
    * 属性变化监听hook
    * @param keys 需要监听的属性值
    * @param project 处理流程
    * @param needSubscribe 是否订阅，默认true
    * @returns [新可观测对象，源可观测对象]
    */
  function useObserver(keys: string|string[],project: (ob\$: Observable) => Observable, needSubscribe: boolean = true): [newOb\$: Observable, oriOb\$: Observable]
### 7、事件组合hook - useEventCompose
> 函数签名：
  /**
    * 事件合成hook
    * @param project 处理流程
    * @returns 合并后的新可观测对象
    */
  function useEventCompose(project: (ob\$: Observable) => Observable): Observable
### 8、状态更新操作符 - update
> 函数签名：
  /**
    * 更新状态操作符
    * @param resultSelector 用于生成需要更新的状态，参数说明：currentState表示组件当前状态，value表示上一个环节传递的值
    * @returns
    */
  function update(resultSelector: (currentState: Object,value: any) => Object): OperatorFunction
### 9、状态机切换操作符 - transition
> 函数签名：
  /**
    * 状态切换操作符
    * @param event 事件名称
    * @param resultSelector 用户生成事件详情数据，参数说明：currentState表示组件当前状态，value表示上一个环节传递的值
    * @returns
    */
  function transition(event: string, resultSelector: (currentState: Object,value: any) => Object): OperatorFunction
### 10、日志打印操作符 - log
> 函数签名：
  /**
    * 记录log
    * 最后一个参数指定console的类型：log|error|warn|info等
    */
  function log(args: any[], type: 'log'|'error'|'warn'|'info'|any): OperatorFunction

## 学习资料
[xstate学习资料](https://xstate.js.org/)
[rxjs学习资料](https://rxjs.dev/)