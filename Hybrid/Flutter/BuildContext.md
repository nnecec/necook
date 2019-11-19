# BuildContext

## 背景
在 Flutter 的开发过程中，使用了 Redux 作为全局状态管理，BLoC 作为局部状态管理的工具。

Redux 直接通过 StoreProvider 和 StoreConnector 订阅获取数据，但在 BLoC 的使用中，按照文档中的方式，会发现 `CupertinoTabScaffold` 外部订阅的数据，在其内部获取不到。由此注意到，BLoC 的区别在于其通过 BuildContext 获取已订阅的数据：

```dart
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final _homeBloc = BlocProvider.of<HomeBloc>(context);
    
    ...
  }
}
```

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
}

// 通过 Navigator 设置 App 的路由
GestureDetector(
  onTap: () {
    Navigator.of(context, rootNavigator: true).pushNamed(
      '/repository',
      arguments: RepositoryArguments(repoName),
    );
  },
)
// 或者
GestureDetector(
  onTap: () {
    Navigator.of(context).pop();
  },
)
```

从上面的使用来看，我们并不会手动的去维护一个 Context，以上的通过 Context 控制路由跳转，或者传递 App 主题数据等都是 Flutter 默默支持的。

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

也可以表示功能性组件如：用于手势检测的 `GestureDetector` 、用于主题数据传递的`Theme`等等。

> Flutter widgets are built using a modern framework that takes inspiration from React. The central idea is that you build your UI out of widgets. Widgets describe what their view should look like given their current configuration and state. When a widget’s state changes, the widget rebuilds its description, which the framework diffs against the previous description in order to determine the minimal changes needed in the underlying render tree to transition from one state to the next.

在官方网站中提到，Flutter Widget 是从 React 获取的灵感，使用 Widget 构建界面。

 Widget 描述了视图当前的配置和状态，它并不是表示最终绘制在设备屏幕上的显示元素。实际上，Flutter 中真正代表屏幕上显示元素的类是`Element`，也就是说 Widget 只是描述`Element`的配置数据。

在 BuildContext 的文档里提到：

> Each widget has its own BuildContext, which becomes the parent of the widget returned by the StatelessWidget.build or State.build function. (And similarly, the parent of any children for RenderObjectWidgets.)
> 
> 每个 widget 都有其自己的BuildContext，它将成为 StatelessWidget.build 或 State.build 函数返回的 widget 的父级。 （同样，RenderObjectWidgets 的任何子项的父项。）

在 Flutter 中，从创建到渲染的流程是：根据 Widget 配置生成 Element，然后通过 Element 创建相应的`RenderObject`，最后再通过`RenderObject`来完成布局排列和绘制。

在 Widget 中，所有的界面显示都是写在 build 函数中的。并且 build 函数默认传入一个`BuildContext`。

```dart
// 1. BuildContext 是一个抽象类
abstract class BuildContext {
  /// The current configuration of the [Element] that is this [BuildContext].
  Widget get widget;

  /// The [BuildOwner] for this context. The [BuildOwner] is in charge of
  /// managing the rendering pipeline for this context.
  BuildOwner get owner;
  ...
}

// 2. 发现 build 调用是发生在 StatelessWidget 和 StatefulWidget 对应的 StatelessElement 和 StatefulElement 的 build 方法中
// 以 StatelessElement 为例
// 3. 可以看到在 build 方法中，传递的是 this，在此例中即是 StatelessElement
class StatelessElement extends ComponentElement {
  ...
  @override
  Widget build() => widget.build(this);
  ...
}
// 4. ComponentElement 中也没有 BuildContext
class StatelessElement extends ComponentElement
...
abstract class ComponentElement extends Element
...
  
// 5. 最终可以找到 Element 是由 BuildContext 实现
abstract class Element extends DiagnosticableTree implements BuildContext 

```

