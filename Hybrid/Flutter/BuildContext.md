# Widget 中的 BuildContext

## 背景

在 Flutter 的开发过程中，使用了 Redux 作为全局状态管理，BLoC 作为局部状态管理的工具。

Redux 直接通过 StoreProvider 和 StoreConnector 订阅获取数据，本质上还是传递 store 给 provider，再通过内部的联系传递给 connector。

BLoC 的区别在于其通过 BuildContext 获取已订阅的数据：

```dart
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final _homeBloc = BlocProvider.of<HomeBloc>(context);

    ...
  }
}
```

但在 BLoC 的使用中，遇到以下的问题。

如果在 CupertinoTabScaffold 外部通过 BlocProvider 提供数据，在 CupertinoTabScaffold 内部却获取不到。

另外如果使用在 CupertinoTabScaffold 内部使用`Navigator.of(context)`也无法控制 CupertinoTabScaffold 外部的路由。

## BuildContext 的用途

在 Flutter 中，BuildContext 有很多用处：

```dart
// 通过 theme 设置 App 的色彩模式
CupertinoApp(
  title: 'FluHub',
  routes: routes,
  initialRoute: '/',
  theme: CupertinoThemeData(
    brightness: Brightness.dark,
    primaryColor: CupertinoColors.white,
    primaryContrastingColor: CupertinoColors.darkBackgroundGray,
    scaffoldBackgroundColor: CupertinoColors.black,
  ), // 设置主题数据
)

Widget build(BuildContext context) {
  final CupertinoThemeData theme = CupertinoTheme.of(context);

  ...

  // 通过 Navigator 设置 App 的路由
  GestureDetector(
    onTap: () {
      // Navigator.of(context, rootNavigator: true).pushNamed('/repository');
      Navigator.of(context).pushNamed('/repository');
    },
  )
  // 或者
  GestureDetector(
    onTap: () {
      Navigator.of(context).pop();
    },
  )
}
```

从上面的使用来看，我们并不会手动的去维护一个 Context，只需要使用 build 中提供的`BuildContext context` 参数。上面通过 Context 控制路由跳转，或者传递 App 主题数据等都是由 BuildContext 提供的功能。而 build 方法又是由 Widget 提供的。

## Widget 是什么

对于 Flutter 来说，一切皆是 Widget。Flutter 中的 Widget 的概念不仅可以表示 UI 元素

```dart
class Card extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return Container(
      margin: EdgeInsets.all(8),
      child: Text('Hello'),
    );
  }
}
```

也可以表示功能性组件如：用于手势检测的  `GestureDetector` 、用于主题数据传递的`Theme`等等。

> Flutter widgets are built using a modern framework that takes inspiration from React. The central idea is that you build your UI out of widgets. Widgets describe what their view should look like given their current configuration and state. When a widget’s state changes, the widget rebuilds its description, which the framework diffs against the previous description in order to determine the minimal changes needed in the underlying render tree to transition from one state to the next.

在官方网站中提到，Flutter Widget 是从 React 获取的灵感，使用 Widget 构建界面。

Widget 描述了视图当前的配置和状态，它并不是表示最终绘制在设备屏幕上的显示元素。实际上，Flutter 中真正代表屏幕上显示元素的类是`Element`，也就是说 Widget 只是描述`Element`的配置数据。

在 BuildContext 的文档里提到：

> Each widget has its own BuildContext, which becomes the parent of the widget returned by the StatelessWidget.build or State.build function. (And similarly, the parent of any children for RenderObjectWidgets.)

每个 widget 都有其自己的 BuildContext，它将成为`StatelessWidget.build`或`State.build`函数返回的 widget 的父级。 （同样，RenderObjectWidgets 的任何子项的父项。）

在 Flutter 中，从创建到渲染的流程是：根据 Widget 配置生成 Element，然后通过 Element 创建相应的`RenderObject`，最后再通过`RenderObject`来完成布局排列和绘制。

在 Widget 中，所有的界面显示都是写在 build 函数中的。并且 build 函数默认传入一个`BuildContext`。

从代码中去寻找 BuildContext 的源头：

```dart
// 1. BuildContext 是一个抽象类
// https://www.zhihu.com/question/20149818 知乎中关于抽象类和接口区别的一些回答
abstract class BuildContext {
  /// The current configuration of the [Element] that is this [BuildContext].
  Widget get widget;

  /// The [BuildOwner] for this context. The [BuildOwner] is in charge of
  /// managing the rendering pipeline for this context.
  BuildOwner get owner;
  ...
}

// 2. 由于 BuildContext 是 build 的参数，回头看 StatelessWidget 和 StatefulWidget 对应的 StatelessElement 和 StatefulElement 的 build 方法
// 以 StatelessElement 为例
// 3. 可以看到在 build 方法中，传递的是 this
class StatelessElement extends ComponentElement {
  ...
  @override
  Widget build() => widget.build(this);
  ...
}
// 4. 由父类 ComponentElement 继续寻找
class StatelessElement extends ComponentElement
...
abstract class ComponentElement extends Element
...

// 5. 最终可以找到 Element 是由 BuildContext 实现
abstract class Element extends DiagnosticableTree implements BuildContext

```

> BuildContext objects are actually Element objects. The BuildContext interface is used to discourage direct manipulation of Element objects.

官方文档中也提到 BuildContext 就是 Element。使用 BuildContext 是为了阻止对 Element 的直接操作。

## of(context)

```dart
//
static NavigatorState of(
  BuildContext context, {
  bool rootNavigator = false,
  bool nullOk = false,
}) {
  final NavigatorState navigator = rootNavigator
    ? context.rootAncestorStateOfType(const TypeMatcher<NavigatorState>())
    : context.ancestorStateOfType(const TypeMatcher<NavigatorState>());
  return navigator;
}
```

`context.rootAncestorStateOfType`和`context.ancestorStateOfType`都在`BuildContext`中定义。

前面提到 BuildContext 就是 Element，再回到 Element 的定义中可以看到这两个方法的具体实现。

```dart
@override
State ancestorStateOfType(TypeMatcher matcher) {
  assert(_debugCheckStateIsActiveForAncestorLookup());
  Element ancestor = _parent;
  while (ancestor != null) {
    if (ancestor is StatefulElement && matcher.check(ancestor.state))
      break; // 查找到符合条件的则停止
    ancestor = ancestor._parent;
  }
  final StatefulElement statefulAncestor = ancestor;
  return statefulAncestor?.state;
}

@override
State rootAncestorStateOfType(TypeMatcher matcher) {
  assert(_debugCheckStateIsActiveForAncestorLookup());
  Element ancestor = _parent;
  StatefulElement statefulAncestor;
  while (ancestor != null) {
    if (ancestor is StatefulElement && matcher.check(ancestor.state))
      statefulAncestor = ancestor; // 一直向上查找直到最后
    ancestor = ancestor._parent;
  }
  return statefulAncestor?.state;
}
```

回到 BuildContext 类，可以看到`context.rootAncestorStateOfType`的注释是

> Returns the [State] object of the furthest ancestor [StatefulWidget] widget that matches the given [TypeMatcher].

`context.ancestorStateOfType`的注释是：

> Returns the [State] object of the nearest ancestor [StatefulWidget] widget that matches the given [TypeMatcher].

再回头看`CupertinoTabScaffold`的定义：

```dart
class CupertinoTabScaffold extends StatefulWidget {

  ...
}
```

所以在 CupertinoTabScaffold 内部的 widget 如果不使用 rootNavigator 则到 CupertinoTabScaffold 就会获取到对应的 context。

## 总结

对于我们编写的 Widget，会在其 build 方法中传入 BuildContext 类型的参数。

我们编写的 Widget 继承自 StatelessWidget/StatefulWidget，这两个类型的 build 方法接受的参数是 StatelessElement/StatefulElement。

这两个 Element 最终继承自 Element，并且 Element 实现了 BuildContext 抽象类。

所以 build 中接受到的 context 就是 Element。

在 Element 中我们可以找到`of(context)`中 context 的具体实现。从而解释了`CupertinoTabScaffold`隔离内外部 context 的原因。

引发的其他问题：

`Element`具体是什么？为什么要阻止对它的直接操作？

`RenderObject`是什么？

## Reference

1. [Flutter 实战](https://book.flutterchina.club/chapter14/element_buildcontext.html)
2. [Flutter | 深入理解 BuildContext](https://juejin.im/post/5c665cb651882562914ec153)
3. [BuildContext class](https://api.flutter.dev/flutter/widgets/BuildContext-class.html)
4. [CupertinoTabScaffold class](https://api.flutter.dev/flutter/cupertino/CupertinoTabScaffold-class.html)
5. [接口和抽象类有什么区别？](https://www.zhihu.com/question/20149818)
