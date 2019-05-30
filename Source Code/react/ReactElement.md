# ReactElement

## createElement

`render`方法实际上调用了`React.createElement`方法，JSX 解析出的结构都会被`createElement`调用。在[不使用JSX](https://reactjs.org/docs/react-without-jsx.html)的文档中，也同样说明了`createElement`是如何使用的。

`type`有如下值：

- HostComponent: `div`, `p`代表原生DOM
- ClassComponent: Class 是继承自 Component 或 PureComponent 的组件
- functional Component: 方法
- Symbol: 原生提供的 Fragment、AsyncMode等

```javascript
export function createElement = function(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref; // 获取 config 中的 ref
    }
    if (hasValidKey(config)) {
      key = '' + config.key; // 获取 config 中的 key
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 剩下的属性添加到 props 上
    for (propName in config) {
      if (// 如果 config 包含 propName 且不是 RESERVED_PROPS 中的属性，则为props赋值该属性（hasOwnProperty 会忽略掉那些从原型链上继承到的属性）
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // 获取 children
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2]; // 将 children 依次缓存到 childArray 中
    }
    props.children = childArray; // 将 children 挂载到 props 上
  }

  // 解析 defaultProps，给当前 props 没有的属性从 defaultProps 取值
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
};
```

## ReactElement

通过传入的属性，构建 ReactElement。

```javascript
const REACT_ELEMENT_TYPE = hasSymbol
  ? Symbol.for('react.element')
  : 0xeac7; // look like React
  
const ReactElement = function(type, key, ref, self, source, owner, props) { // self source 在开发环境中生效
  const element = {
    // 唯一识别 ReactElement 的标记
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key, // key标记 提升 update 性能
    ref: ref, // 真实 DOM 引用
    props: props, // 子结构（有则增加 children 字段 / 没有为空），属性如 style

    _owner: owner, // _owner === ReactCurrentOwner.current(ReactCurrentOwner.js),值为创建当前组件的对象，默认值为 null。
  };

  return element;
};
```

## cloneElement

扩展方法。克隆一个 ReactElement，其中 props 是浅拷贝的。

```javascript

export function cloneElement(element, config, children) {
  let propName;

  // 缓存 props key ref
  const props = Object.assign({}, element.props); // 浅拷贝

  let key = element.key;
  let ref = element.ref;

  const self = element._self;
  const source = element._source;

  let owner = element._owner;

  // 类似 createElement 中处理 props 和 children 的方法
  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    let defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }v

  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}
```