# A Tour of the Dart language

受到《为 JavaScript 开发人员准备的 Dart 参考教程》启发，该文章内容来自官方的 Language Tour，并将语法与 JavaScript(ES6) 对比。

## 重要概念

- 所有能够使用变量引用的都是对象， 每个对象都是一个类的实例。
- Dart 是强类型的，但 Type 注释依然是可选择的。
- Dart 支持范型，如 `List<int>`。
- Dart 支持顶级方法 (如 main())，同时还支持在类中或方法中定义函数。
- 同样，Dart 支持顶级变量，以及在类中定义变量。
- Dart 没有 public、 protected、 和 private 关键字。如果以 (\_) 开头，则该标识符是私有的。
- 标识符以字母或者下划线(\_)开头，后面可以是其他字符和数字的组合。
- Dart 有表达式 expression(有运行时)和语句 statement(无运行时)。语句通常包含一个或多个表达式，但是表达式不能直接包含语句。如 expression: condition ? expr1 : expr2 与 if-else statement。
- Dart 工具可以指出两种问题：警告和错误。

## 变量

| Dart                                    | JavaScript         | Note                                                             |
| --------------------------------------- | ------------------ | ---------------------------------------------------------------- |
| var name = 'Bob';                       | let name = 'Bob'   |                                                                  |
| String name = 'Bob';                    |                    | 在变量声明时添加类型                                             |
| int lineCount;                          |                    | 未设置初始值的变量默认值为 null                                  |
| final name = 'Bob'; const name = 'Bob'; | const name = 'Bob' | 区别是 final 可以接收一个变量但 const 不行，多数情况下使用 final |

## 内建类型

### Numbers

- int
- double

```dart
// String -> int
var one = int.parse('1');
assert(one == 1);

// String -> double
var onePointOne = double.parse('1.1');
assert(onePointOne == 1.1);

// int -> String
String oneAsString = 1.toString();
assert(oneAsString == '1');

// double -> String
String piAsString = 3.14159.toStringAsFixed(2);
assert(piAsString == '3.14');
```

### Strings

```dart
// 模版字符串
var s = 'string interpolation';

assert('Dart has $s, which is very handy.' ==
    'Dart has string interpolation, ' +
        'which is very handy.');
assert('That deserves all caps. ' +
        '${s.toUpperCase()} is very handy!' ==
    'That deserves all caps. ' +
        'STRING INTERPOLATION is very handy!');

// 创建多行字符串
var s1 = '''
You can create
multi-line strings like this one.
''';
```

### Booleans

Dart 中布尔与 1 或 0 是不同的类型，所以比较的结果都是 false。

### Lists

下标索引从 0 开始，最后一个为 list.length - 1。

在 list 变量前添加 const 关键字，定义一个不变的 list 对象。

```dart
// list.length == 3
// list[1] == 2
var list = [1, 2, 3];

var constantList = const [1, 2, 3];

// 展开符
var list = [1, 2, 3];
var list2 = [0, ...list];
assert(list2.length == 4);

var list;
var list2 = [0, ...?list]; // 如果 list 可能为空， 使用...?

// 使用 if 和 for 循环
var nav = [
  'Home',
  'Furniture',
  'Plants',
  if (promoActive) 'Outlet'
];

var listOfInts = [1, 2, 3];
var listOfStrings = [
  '#0',
  for (var i in listOfInts) '#$i'
];
assert(listOfStrings[1] == '#1');
```

### Sets

```dart
var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};

var elements = <String>{};
elements.add('fluorine');
elements.addAll(halogens);
// elements.length == 5

final constantSet = const {'fluorine', 'chlorine', 'bromine', 'iodine'};

// 与 Lists 类似，支持 展开符, if, for
```

### Maps

```dart
var gifts = {
  // Key:    Value
  'first': 'partridge',
  'second': 'turtledoves',
};

var gifts = Map();
gifts['first'] = 'partridge';
gifts['second'] = 'turtledoves';
gifts['fifth'] = 'golden rings';
// gifts.length == 3

final constantMap = const {
  2: 'helium',
  10: 'neon',
  18: 'argon',
};

// 与 Lists 类似，支持 展开符, if, for
```

### Runes

In Dart, runes are the UTF-32 code points of a string.

### Symbols

```dart
#radix
#bar
```

## Functions 函数

| Dart                                            | JavaScript                                                         | Note                                    |
| ----------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------- |
| void a() {}                                     | function a(){}                                                     |
| final a = (){}                                  | const a = function (){}                                            |
| String a() => 'hello'                           | const a = () => 'hello'                                            |
| String a(String b = 'world') => \`Hello \${b}\` | const a = (b = 'world') => \`Hello \${b}` | 同样支持对参数初始化值 |
| void a(String b, [String c]){}                  |                                                                    | c 是可选参数，Dart 必须明确参数是否可选 |

Dart 是一门面向对象的语言。与 JavaScript 类似，函数都是一类公民。每一个应用都必须包含一个顶级方法`main()`作为入口。`main()`返回 void，并且有类似 arguments 的可选参数。

```dart
String say(String from, String msg, [String device]) {}
// Optional named parameters
say(from: 'Bob', msg: 'Howdy');
// Optional positional parameters
say('Bob', 'Howdy')
// Default parameter values
String say(String from, String msg = 'hi') {}

// ..类似链式操作
void main() {
  querySelector('#sample_text_id')
    ..text = 'Click me!'
    ..onClick.listen(reverseText);
}
```

### 一类对象

- 将函数作为参数传给另一个函数
- 匿名函数

  ```dart
  list.forEach((item) {
    print('${list.indexOf(item)}: $item');
  });
  ```

- Dart 变量的作用域在写代码的时候就已经确定。与 JavaScript 类似，大括号的范围就是作用域。

- 闭包

  ```dart
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

- 所有函数都返回值。如果没有指定返回值，则语句返回 null 隐式附加到函数体。

## 操作符

| Dart                                                        | JavaScript                                                          | Note |
| ----------------------------------------------------------- | ------------------------------------------------------------------- | ---- |
| emp is Person                                               | emp instanceof Person                                               |
| emp is! Person                                              | !emp instanceof Person                                              |
| name ?? 'Guest'                                             | if (name === null) return 'Guest'                                   |
| querySelector('#confirm')<br>&nbsp;&nbsp;..text = 'Confirm' | var button = querySelector('#confirm');<br>button.text = 'Confirm'; |
| foo?.bar                                                    | if(foo) return foo.bar                                              |

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

| Dart                                                  | JavaScript                                 | Note |
| ----------------------------------------------------- | ------------------------------------------ | ---- |
| throw FormatException('Expected at least 1 section'); | throw Error('Expected at least 1 section') |

```dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  // A specific exception
  buyMoreLlamas();
} on Exception catch (e) {
  // Anything else that is an exception
  print('Unknown exception: $e');
} catch (e, s) {
  // No specified type, handles all
  print('Something really unknown: $e');

  // 允许继续向后传播
  rethrow;
} finally {
  cleanLlamaStalls(); // Then clean up.
}
```

## 类

Dart 的类与 JavaScript 细节上有很多区别，建议去[Tour](https://dart.dev/guides/language/language-tour#classes)中查看

```dart
class Point {
  num x; // 初始值为 null
  num y;
  num z = 0;

  Point(num x, num y) { // 简化写法 Point(this.x, this.y);
    // 建议忽略 this，仅在重名时使用
    this.x = x;
    this.y = y;
  }

  // 或者使用Named constructor
  Point.origin() {
    x = 0;
    y = 0;
  }
}

// 使用构造函数
var p1 = Point(2, 2); // 与 JavaScript 类似的访问方式 p1.x === 2
var p2 = Point.fromJson({'x': 1, 'y': 2});

```

## 泛型

## 库

每个 Dart 应用都是一个库。以下划线 (\_) 开头的标识符只有在库内部可见。

| Dart                                                                                                                                         | JavaScript                    | Note                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------- |
| import 'dart:html';                                                                                                                          | import 'es6-promise'          |                                           |
| import 'package:test/test.dart';                                                                                                             | import './test/test.js'       |                                           |
| import 'package:lib2/lib2.dart' as lib2;                                                                                                     | import lib as lib2 from 'lib' |                                           |
| import 'package:lib1/lib1.dart' show foo;                                                                                                    | import { foo } from 'bar'     | import 'package:lib2/lib2.dart' hide foo; |
| import 'package:greetings/hello.dart' deferred as hello; <br> greet() async {<br> await hello.loadLibrary();<br> hello.printGreeting();<br>} |                               | 懒加载库                                  |

## 异步支持

| Dart                                                                         | JavaScript                                                                       | Note |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---- |
| Future checkVersion() async {<br>&nbsp;var version = await lookUpVersion();} | async function checkVersion(){<br>&nbsp;let version = await lookUpVersion()<br>} |      |
| Future\<String> lookUpVersion() async => '1.0.0';                            | main = async () => '1.0.0'                                                       |      |

### Handling Streams

## Generators

## Metadata

- @deprecated
- @override

```dart
library todo;

class Todo {
  final String who;
  final String what;

  const Todo(this.who, this.what);
}


import 'todo.dart';

@Todo('seth', 'make this do something')
void doSomething() {
  print('do something');
}
```

## 注释

## 参考

1. [为 JavaScript 开发人员准备的 Dart 参考教程](https://zhuanlan.zhihu.com/p/54949074)
2. [language tour](https://dart.dev/guides/language/language-tour)
3. `assert()`在生产环境会被忽略。在开发环境中，`assert()`会在判断式不为 true 时抛出错误。
