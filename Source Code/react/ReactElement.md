# ReactElement

定义 React 中元素

```javascript
const REACT_ELEMENT_TYPE = hasSymbol
  ? Symbol.for('react.element')
  : 0xeac7;
  
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 唯一识别 ReactElement 的标记
    $$typeof: REACT_ELEMENT_TYPE,

    // 内建属性
    type: type,
    key: key, // key标记 提升 update 性能
    ref: ref, // 真实 DOM 引用
    props: props, // 子结构（有则增加 children 字段 / 没有为空），属性如 style

    _owner: owner, // _owner === ReactCurrentOwner.current(ReactCurrentOwner.js),值为创建当前组件的对象，默认值为 null。
  };

  return element;
};
```

## createElement

`render`方法实际上调用了`React.createElement`方法

```javascript

/**
 * 使用 JSX 会被转换为调用该方法
 * type - 元素类型，值为 'div', class or function, React fragment
 *
 */
export function createElement = function(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 保留的属性被添加到 props 上
    for (propName in config) {
      if (// 如果 config 包含 propName 且不是 RESERVED_PROPS 中的属性，则为props赋值该属性
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // children 可以不止一个
  // the newly allocated props object.
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

  // 解析 defaultProps
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