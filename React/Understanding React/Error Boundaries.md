# Error Boundaries 错误边界

通过 `static getDerivedStateFromError()`或者`componentDidCatch()`使类组件拥有错误边界。

在错误边界中处理组件抛出的错误，保护应用不受到组件错误的影响而崩溃。

```javascript
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }
```

## Reference

1. [Error Boundaries](https://reactjs.org/docs/error-boundaries.html)