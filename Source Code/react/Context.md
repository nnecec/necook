# Context

```javascript
// 创建 Context
const MyContext = React.createContext(defaultValue);

// Provider 提供值
<MyContext.Provider value={/* some value */}></MyContext.Provider>

// 通过 contextType 订阅 Context
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* perform a side-effect at mount using the value of MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* render something based on the value of MyContext */
  }
}
MyClass.contextType = MyContext;

// 或者通过 Context.Consumer 订阅
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```