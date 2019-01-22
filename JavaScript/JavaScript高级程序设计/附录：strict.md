严格模式

- 变量：初始化未经声明的变量会导致错误。
- 函数：重写 arguments 的值会导致语法错误，修改 arguments 值不会影响入参。
- 函数：arguments.callee 和 arguments.caller 不可访问
- 函数：this 不会指向全局对象，将是 undefined