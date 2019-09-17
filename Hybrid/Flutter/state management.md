# 状态管理

## 使用自带的 StatefulWidget 管理

使用 StatefulWidget时，类似 React 中的 state 和 setState，可以在内部通过 setState 重新为变量赋值，并重新渲染界面。

同样，调用多次 setState 也是会批量更新。

```dart
class MyHomepage extends StatefulWidget {
  @override
  _MyHomepageState createState() => _MyHomepageState();
}

class _MyHomepageState extends State<MyHomepage> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: _index,
      onTap: (newIndex) {
        setState(() {
          _index = newIndex;
        });
      },
      // ... items ...
    );
  }
}
```

## 生命周期

StatefulWidget 可以使用生命周期方法。

### 初始化

1. createState()
2. initState()
3. didChangeDependencies()
4. build()

### 改变 state

热更新也是该步骤

1. didUpdateWidget(oldWidget)
2. build()

### 卸载

调用`dispose`之后，组件被视为已卸载。

1. deactivate()
2. dispose()

### 切换后台

切换到后台：

1. AppLifecycleState.inactive
2. AppLifecycleState.paused

再打开：

1. AppLifecycleState.inactive
2. AppLifecycleState.resumed

```dart
class TestState extends State<Test> with WidgetsBindingObserver {
  @override
  void initState(){
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  Widget build(BuildContext context){
    // ...
  }

  // 退出到后台再打开app
  // flutter: AppLifecycleState.inactive
  // flutter: AppLifecycleState.paused
  // flutter: AppLifecycleState.inactive
  // flutter: AppLifecycleState.resumed
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    debugPrint('$state');
  }

  @override
  void dispose(){
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }
}
```

## 全局状态管理

在[官方对于状态管理的介绍](https://flutter.dev/docs/development/data-and-backend/state-mgmt/options)中，提供了 Provider, Scoped Model, Redux, BLoC, MobX等介绍。在简单了解后，因为更熟悉 Redux 的模式，以及考虑学习使用 Stream，选择了 Redux 和 BLoC 两种结合来管理状态。并且在一篇 [Medium 文章](https://medium.com/flutter-community/let-me-help-you-to-understand-and-choose-a-state-management-solution-for-your-app-9ffeac834ee3)中提到，他认为 BLoC 和 Redux 结合起来是更好的模式。

BLoC 的主要特点是使用 stream 作为状态管理的实现，我们可以修改 stream。同样也可以监听 stream，当监听到 stream 中发生了修改。

由于 BloC 使用 context 传递值，且模版代码更少，所以更适合使用 BLoC 处理局部状态，Redux 处理全局状态。

- 在 Redux 中记录 token/主题/当前登录用户信息/语言。
- 在页面中使用 BLoC 请求并储存返回数据。

### BLoC

```dart
// home_state.dart
@immutable
abstract class HomeState extends Equatable {
  HomeState([List props = const <dynamic>[]]) : super(props);
}

class HomeStateEmpty extends HomeState {
  @override
  String toString() => 'HomeStateEmpty';
}

class HomeStateLoading extends HomeState {
  @override
  String toString() => 'HomeStateLoading';
}

class HomeStateSuccess extends HomeState {
  final dynamic events;

  HomeStateSuccess({@required this.events}) : super([events]);

  @override
  String toString() => 'HomeStateSuccess';
}

class HomeStateError extends HomeState {
  final error;

  HomeStateError(this.error) : super([error]);

  @override
  String toString() => 'HomeStateError';
}

// home_event.dart
@immutable
abstract class HomeEvent extends Equatable {
  HomeEvent([List props = const <dynamic>[]]) : super(props);
}

class EventsList extends HomeEvent {
  final String login;

  EventsList({@required this.login}): super([login]);

  @override
  String toString() => 'EventsList { login: $login }';
}

// home_bloc.dart
import 'package:bloc/bloc.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import './bloc.dart';
import '../models/repository.dart';

import '../../../utils/graphql_client.dart';
import '../../../utils/githubV3_client.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  @override
  HomeState get initialState => HomeStateEmpty();

  @override
  Stream<HomeState> mapEventToState(
    HomeEvent event,
  ) async* {
    if (event is EventsList) {
      yield HomeStateLoading();
      try {
        final List events = await v3.get('/users/${event.login}/received_events');
        yield HomeStateSuccess(events: events);
      } catch (error) {
        yield HomeStateError(error);
      }
    }
  }
}

// home_screen.dart
class HomeScreenState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final _homeBloc = BlocProvider.of<HomeBloc>(context);

    return BlocBuilder<HomeBloc, HomeState>(
      builder: (BuildContext context, HomeState state) {
        if (state is HomeStateEmpty) {
          _homeBloc.dispatch(EventsList(login: 'nnecec'));
        }
        ...
      }
    )
  }
}
```

在界面中订阅

```dart
// root.dart
// 在 home 的父级中，新增 BlocProvider 并导入 HomeBloc

import './home/bloc/bloc.dart';

...
...

MultiBlocProvider(
  providers: [
    BlocProvider<HomeBloc>(
      builder: (BuildContext context) => HomeBloc(),
    ),
  ],
  child: HomeScreen(),
);
...

// home_screen.dart
// 在 home 页面中，获取 HomeBloc 方法，并在 BlocBuilder 中 订阅/修改 home bloc 状态
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import './bloc/bloc.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final _homeBloc = BlocProvider.of<HomeBloc>(context);

    return BlocBuilder<HomeBloc, HomeState>(
      builder: (BuildContext context, HomeState state) {
        if (state is HomeStateEmpty) {
          _homeBloc.dispatch(EventsList(login: 'nnecec'));
        }
        if (state is HomeStateSuccess) {
          return Container(
            ...
          );
        }

        return Text('');
      },
    );
  }
}
```

### Redux
