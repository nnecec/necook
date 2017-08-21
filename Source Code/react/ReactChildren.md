# [ReactChildren](https://facebook.github.io/react/docs/react-api.html#react.children)

提供处理`this.props.children`的方法。

this.props.children 的值有三种可能：如果当前组件没有子节点，它就是`undefined`;如果有一个子节点，数据类型是`object` ；如果有多个子节点，数据类型就是`array`。

```javascript
var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  count: countChildren,
  toArray: toArray,
};
```

## forEachChildren

```javascript
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = getPooledTraverseContext(
    null,
    null,
    forEachFunc,
    forEachContext,
  );
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function forEachSingleChild(bookKeeping, child, name) {
  var {func, context} = bookKeeping;
  func.call(context, child, bookKeeping.count++);
}
```

## mapChildren

```javascript
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}
```

`mapChildren`相较于`forEachChildren`多了`array`和`escapedPrefix`参数。

## count

返回Children的总数

```javascript
function countChildren(children, context) {
  return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
}
```

## toArray

```javascript
// 返回Children的array格式
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(
    children,
    result,
    null,
    emptyFunction.thatReturnsArgument,
  );
  return result;
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}
```

## common

```javascript
// getPooledTraverseContext 获取在pool中的遍历上下文
// 如果 traverseContextPool 中存有值，则pop出最后一个，并为其赋值
// 如果没有，则返回一个对象，并赋值且count为0

var traverseContextPool = [];
function getPooledTraverseContext(
  mapResult,
  keyPrefix,
  mapFunction,
  mapContext,
) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0,
    };
  }
}
```

```javascript
// 遍历所有 Children 执行callback
// callback 执行过程调用 traverseContext.func 对 child 进行处理，或者将 child 塞入 traverseContext 中
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}
// 当 props.children 为单节点形式时，对该节点执行 callback 回调，间接执行 traverseContext.func 函数
// 当 props.children 为嵌套节点形式时，递归调用 traverseAllChildrenImpl 遍历子孙节点
function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext,
) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') { // 该条件 children 为null
    children = null;
  }

  if (
    children === null ||
    type === 'string' ||
    type === 'number' ||
    (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) // 是普通节点或者是react element 节点
  ) {
    callback( // 对节点执行 callback
      traverseContext,
      children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar,
    );
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // 当前子节点树的数量
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext,
      );
    }
  } else {
    var iteratorFn =
      (ITERATOR_SYMBOL && children[ITERATOR_SYMBOL]) ||
      children[FAUX_ITERATOR_SYMBOL];
    if (typeof iteratorFn === 'function') {
      if (__DEV__) {
        if (iteratorFn === children.entries) {
          warning(
            didWarnAboutMaps,
            'Using Maps as children is unsupported and will likely yield ' +
              'unexpected results. Convert it to a sequence/iterable of keyed ' +
              'ReactElements instead.%s',
            getStackAddendum(),
          );
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext,
        );
      }
    } else if (type === 'object') { // 不满足条件的 object 输出报错信息
      var addendum = '';
      if (__DEV__) {
        addendum =
          ' If you meant to render a collection of children, use an array ' +
          'instead.' +
          getStackAddendum();
      }
      var childrenString = '' + children;
      invariant(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        childrenString === '[object Object]'
          ? 'object with keys {' + Object.keys(children).join(', ') + '}'
          : childrenString,
        addendum,
      );
    }
  }

  return subtreeCount;
}
```

traverseAllChildrenImpl: 如果children是react element则执行callback，并返回计数+1。如果是Array，则为react element数组，则遍历数组并再次调用`traverseAllChildrenImpl`。如果是function，取function的iterator，在iterator完成之前便利执行`traverseAllChildrenImpl`。如果仅仅是对象，`props.children`为属性信息。

```javascript
function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}

// react包下ReactChildren模块中，traverseContext存储遍历的执行函数，用于执行traverseContext.func方法  
// react包下flattenChildren模块中，traverseContext作为引用传递输出的最终结果result，用于将子元素扁平化  
// react包下ReactChildReconciler模块中，traverseContext获取props.children相关react组件实例的集合  
```

releaseTraverseContext: 发布遍历上下文
