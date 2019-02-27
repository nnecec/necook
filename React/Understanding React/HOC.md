# Higher-Order Components 高阶组件

高阶组件是一个函数，能够接受一个组件作为参数并返回一个新的组件。高阶组件是通过将原组件包裹在容器组件里面的方式来组合使用原组件。高阶组件就是一个没有副作用的纯函数。

## 实现方法

1. Props Proxy

    ```javascript
    function ppHOC(WrappedComponent) {  
      return class PP extends React.Component {
        render() {
          return <WrappedComponent {...this.props}/>
        }  
      }
    }
    ```

    HOC在 render 方法中返回了一个 WrappedComponent 类型的 React Element，并且可以传入 HOC 接受到的 props。

    使用 Props Proxy 可以:

    - 操作 props
      可以读取、添加、编辑、删除传给 WrappedComponent 的 props
    - 通过 Refs 访问到组件实例
      可以通过引用（ref）访问到 this （WrappedComponent 的实例），但为了得到引用，WrappedComponent 还需要一个初始渲染，意味着你需要在 HOC 的 render 方法中返回 WrappedComponent 元素，让 React 开始它的一致化处理，你就可以得到 WrappedComponent 的实例的引用
    - 提取 state
      可以通过传入 props 和回调函数把 state 提取出来，类似于 [dumb and smart component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.o2qmm6j3h)。
    - 用其他元素包裹 WrappedComponent

2. Inheritance Inversion

    Inheritance Inversion (II) 的最简实现：

    ```javascript
    function iiHOC(WrappedComponent) {
      return class Enhancer extends WrappedComponent {
        render() {
          return super.render()
        }
      }
    }
    ```

    可以用 Inheritance Inversion:

    - 渲染劫持（Render Highjacking）
      - 在由 render输出的任何 React 元素中读取、添加、编辑、删除 props
      - 读取和修改由 render 输出的 React 元素树
      - 有条件地渲染元素树
      - 把样式包裹进元素树（就像在 Props Proxy 中的那样）
    - 操作 state

## Reference

1. [深入理解 React 高阶组件](https://zhuanlan.zhihu.com/p/24776678)
2. [React 中的高阶组件及其应用场景](https://juejin.im/post/5c72b97de51d4545c66f75d5)