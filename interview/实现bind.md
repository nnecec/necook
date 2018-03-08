## STEP 1

```javascript
Function.prototype.bind = function (params) {
    var _this = this
    var args = Array.prototype.slice(arguments, 1)
    return function() {
        return _this.apply(params, args)
    }
}
```

## STEP 2 使生成的function可接受参数

```javascript
Function.prototype.bind = function (params) {
    var _this = this
    var args = Array.prototype.slice(arguments, 1)
    return function() {
        // 这个地方的arguments是最后生成函数传入的参数
        return _this.apply(params, args.concat(Array.prototype.slice.call(arguments)))
    }
}
```

## STEP 3 使生产的function继承原型链

```javascript
Function.prototype.bind = function (params) {
    var _this = this
    var args = Array.prototype.slice(arguments, 1)
    var middleFunction = function() {}
    
    var boundFunction = function() {
        // 这个地方的arguments是最后生成函数传入的参数
        return _this.apply(params, args.concat(Array.prototype.slice.call(arguments)))
    }
    
    middleFunction.prototype = _this.prototype
    boundFunction.prototype = new middleFunction()
    return boundFunction
}
```

说明绑定过后的函数被`new`实例化之后，需要继承原函数的原型链方法，且绑定过程中提供的this被忽略（继承原函数的this对象），但是参数还是会使用。

## STEP 4 如果对函数作new操作

