# React

>  React的生命周期

- 实例化

  当组件在客户端被实例化，第一次被创建时，以下方法依次被调用：

  1. getDefaultProps：对于每个组件实例，这个方法只会调用一次，其返回的对象可以用于设置默认的 props(properties的缩写) 值；
  2. getInitialState：对于组件的每个实例，这个方法的调用有且只有一次，用来初始化每个实例的 state，在这个方法里，可以访问组件的 props。每一个React组件都有自己的 state，其与 props 的区别在于 state只存在组件的内部，props 在所有实例中共享；
  3. componentWillMount
  4. render：render方法返回的结果并不是真正的DOM元素，而是一个虚拟的表现，类似于一个DOM tree的结构的对象；
  5. componentDidMount：可以再该方法中通过 this.getDOMNode() 访问到真实的 DOM(推荐使用 ReactDOM.findDOMNode())。

  当组件在服务端被实例化，首次被创建时，以下方法依次被调用：

  1. getDefaultProps
  2. getInitialState
  3. componentWillMount
  4. render

  componentDidMount 不会在服务端被渲染的过程中调用。

  这些方法不会在首次 render 组件的周期调用

  - componentWillReceiveProps
  - shouldComponentUpdate
  - componentWillUpdate
  - componentDidUpdate

- 存在期

  此时组件已经渲染好并且用户可以与它进行交互，比如鼠标点击，手指点按，或者其它的一些事件，导致应用状态的改变，你将会看到下面的方法依次被调用

  1. componentWillReceiveProps：组件的 props 属性可以通过父组件来更改，这时，componentWillReceiveProps 将c被调用。
  2. shouldComponentUpdate：如果你确定组件的 props 或者 state 的改变不需要重新渲染，可以通过在这个方法里通过返回 `false` 来阻止组件的重新渲染，返回 `false 则不会执行 render 以及后面的 componentWillUpdate，componentDidUpdate 方法。
  3. componentWillUpdate
  4. render
  5. componentDidUpdate

- 销毁时

  componentWillUnmount
  每当React使用完一个组件，这个组件必须从 DOM 中卸载后被销毁，此时 componentWillUnmout 会被执行，完成所有的清理和销毁工作，在 componentDidMount 中添加的任务都需要再该方法中撤销，如创建的定时器或事件监听器。

  当再次装载组件时，以下方法会被依次调用：

  1. getInitialState
  2. componentWillMount
  3. render
  4. componentDidMount

- 反模式

  在 getInitialState 方法中，尝试通过 this.props 来创建 state 的做法是一种反模式。经过计算后的值不应该赋给 state，正确的模式应该是在渲染时计算这些值。这样保证了计算后的值永远不会与派生出它的 props 值不同步。

> react调用事件方法为什么需要bind(this)

调用 `bind(this)` 将事件函数上下文绑定要组件实例上。不使用bind的话，一是使用箭头函数，二是在调用时传递this`onClick={(e) => this.handleClick(e)}`