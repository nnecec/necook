# createElement

## ReactElement

```javascript
var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;

var ReactElement = function(type, key, ref, self, source, owner, props) {
  var element = {
		// 唯一识别 ReactElement 的标记
    $$typeof: REACT_ELEMENT_TYPE,

		// element 内建属性
    type: type,
    key: key,
    ref: ref,
    props: props,

		// 记录创建此元素的组件
    _owner: owner,
  };

  if (__DEV__) {
		// 当前变化的验证标志。
		// 我们把它放在一个外部备份存储, 以便我们可以冻结整个对象。
		// 在普通的开发环境中实现, 可以用 WeakMap 替换。
    element._store = {};

		// 为了使比较 ReactElements 更容易测试, 我们使
    // 验证标志 non-enumerable (在可能的情况下, 应包括我们运行测试的每个环境),
		// 所以测试框架忽略它。
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    });
		// self 以及 source 是DEV的特有属性
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self,
    });
		// 在两个不同的地方创建的两个元素应该被考虑
    // 等同于测试目的, 因此我们将其隐藏在枚举中。
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```

## createElement

```javascript
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

function hasValidRef(config) {
  if (__DEV__) {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get; // 返回指定对象一个自有属性对应的属性描述符
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;// config 不为 null 则 config.ref 不为 null
}

function hasValidKey(config) {
  if (__DEV__) {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

ReactElement.createElement = function(type, config, children) {
  var propName;

  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (// 如果 config 包含 propName 且不是 RESERVED_PROPS 中的属性，则为props赋值该属性
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // children 可以是多个参数,都转移到新分配的props对象
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength); // Array() 与 new Array() 创建数组得到的结果是一样的
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // 解析 defaultProps
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    if (key || ref) {
      if (
        typeof props.$$typeof === 'undefined' ||
        props.$$typeof !== REACT_ELEMENT_TYPE
      ) {
        var displayName = typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
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