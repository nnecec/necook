# A Tour of the Dart language

受到《为 JavaScript 开发人员准备的 Dart 参考教程》启发，该笔记内容来自官方的 Language Tour，并将语法与 JavaScript(ES6) 对比。

## 重要概念

- 所有能够使用变量引用的都是对象， 每个对象都是一个类的实例。
- Dart 是强类型的，但 Type 注释依然是可选择的。
- Dart 支持范型，如 `List<int>`。
- Dart 支持顶级方法 (如 main())，同时还支持在类中或方法中定义函数。
- 同样，Dart 支持顶级变量，以及在类中定义变量。
- Dart 没有 public、 protected、 和 private 关键字。如果以 (_) 开头，则该标识符是私有的。
- 标识符以字母或者下划线(_)开头，后面可以是其他字符和数字的组合。
- Dart 有表达式 expression(有运行时)和语句 statement(无运行时)。语句通常包含一个或多个表达式，但是表达式不能直接包含语句。如 expression: condition ? expr1 : expr2 与 if-else statement。
- Dart 工具可以指出两种问题：警告和错误。

## 变量

Dart | JavaScript | Note
| - | - | - |
var name = 'Bob' | let name = 'Bob'
String name = 'Bob'| | 在变量声明时添加类型
int lineCount | | 未设置初始值的变量默认值为 null
final name = 'Bob' const name = 'Bob' | const name = 'Bob'  | final 和 const 的区别是 final 可以接收一个变量但 const 不行，多数情况下使用 final 来定义只赋值一次的值

## 内建类型

## 函数

Dart | JavaScript | Note
| - | - | - |
void a() {} | function a(){}
final a = (){} | const a = function (){}
String a() => 'hello' | const a = () => 'hello'
String a(String b = 'world') => \`Hello ${b}\` | const a = (b = 'world') => \`Hello ${b}` | 同样支持对参数初始化值
void a(String b, [String c]){} | | c 是可选参数

每一个应用都必须包含一个顶级方法`main()`作为入口。`main()`返回 void，并且有类似 arguments 的可选参数。

Dart 变量的作用域在写代码的时候就已经确定。基本上大括号的范围就是作用域，作用域范围与 JavaScript 类似。

Dart 同样也可以使用闭包：

```dart
// Returns a function that adds [addBy] to the function's argument.
Function makeAdder(num addBy) {
  return (num i) => addBy + i;
}

void main() {
  // Create a function that adds 2.
  var add2 = makeAdder(2);

  // Create a function that adds 4.
  var add4 = makeAdder(4);

  assert(add2(3) == 5);
  assert(add4(3) == 7);
}
```

所有函数都返回值。如果没有指定返回值，则语句返回 null 隐式附加到函数体。

## 操作符

Dart | JavaScript | Note
| - | - | - |
emp is Person | emp instanceof Person
emp is! Person | !emp instanceof Person
name ?? 'Guest' | if (name === null) return 'Guest'
querySelector('#confirm')<br>&nbsp;&nbsp;..text = 'Confirm' | var button = querySelector('#confirm');<br>button.text = 'Confirm';
foo?.bar | if(foo) return foo.bar

## 流程控制语句

- if and else
- for loops
- while and do-while loops
- break and continue
- switch and case
- assert

  如果条件表达式结果不满足需要，则可以使用 assert 语句来打断代码的执行。assert 只会在开发环境生效。类似 debugger。

  `assert(text != null);`

## 异常

## 类

Dart | JavaScript | Note
| - | - | - |
class Point {<br>&nbsp;num x, y;<br>&nbsp;Point(num x) {<br>&nbsp;&nbsp;this.x = x;<br>&nbsp;}<br>} | class Point {<br>&nbsp;constructor(x){<br>&nbsp;&nbsp;this.x = x;<br>&nbsp;}<br>} | 只有当名字冲突的时候才使用 this。Dart 代码风格样式推荐忽略 this。

## 泛型

## 库

每个 Dart 应用都是一个库。以下划线 (_) 开头的标识符只有在库内部可见。

Dart | JavaScript | Note
| - | - | - |
import 'dart:html'; | import 'es6-promise'
import 'package:test/test.dart'; | import './test/test.js'
import 'package:lib2/lib2.dart' as lib2; | import lib as lib2 from 'lib'
import 'package:lib1/lib1.dart' show foo; | import { foo } from 'bar' | import 'package:lib2/lib2.dart' hide foo;
import 'package:greetings/hello.dart' deferred as hello; <br><br> greet() async {<br>&nbsp;await hello.loadLibrary();<br>&nbsp;hello.printGreeting();<br>} | | 懒加载库

## 异步支持

Dart | JavaScript | Note
| - | - | - |
Future<String> lookUpVersion() async => '1.0.0'; | main = async () => '1.0.0'

## Generators

## Metadata

## 注释

## 参考

1. [为 JavaScript 开发人员准备的 Dart 参考教程](https://zhuanlan.zhihu.com/p/54949074)
2. [language tour](https://dart.dev/guides/language/language-tour)