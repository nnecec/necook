# 变量
---

驼峰+语义化：yyyymmdstr -> yearMonthDay

可搜索名称：86400 -> const SECONDS_IN_A_DAY = 86400;

明确参数: l -> location

不要增加不需要的内容：carModel -> model

# 函数
---

参数过多时使用Object替代：function createMenu(title, body, buttonText, cancellable) -> const menuConfig = {title: 'Foo',body: 'Bar',buttonText: 'Baz',cancellable: true};function createMenu(config)

函数应当只做一件事情

函数名语义化

函数分割抽象成单层

移除复制的代码

使用`Object.assign`设置默认Objects

不要把判断标识用于函数参数

避免副作用

不要写global functions

函数式编程代替命令式编程

压缩条件式语句

避免使用否定条件

避免使用条件判断

避免类型检查

避免过度优化：for (let i = 0, len = list.length; i < len; i++) -> for (let i = 0; i < list.length; i++)

移除已经不使用的代码

# 对象和数据结构
---

使用getters和setters

为对象添加私有成员

# 类
---

单一功能原则

Open/Closed Principle (OCP)

Liskov Substitution Principle 里氏替换原则

Interface Segregation Principle (ISP) 接口隔离原则

Dependency Inversion Principle (DIP)

使用ES2015/ES6的classes而不是ES5的functions

使用链式方法

使用组合而不是继承

# 测试
---

单例测试

# 并发
---

使用Promise而不是callback

Async/Await比Promises更清晰

# 错误处理
---

别忽略捕获的错误

别忽略返回的promise错误

# 格式
---

使用风格一致的命名

减少函数的调用与被调用

# 注释
---

只注释逻辑复杂的代码

不要留下注释的无用代码

不要写日志型注释

避免标志性注释