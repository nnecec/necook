# Bloc

## 基本概念

### Events

Events 是 Bloc 的入口。比如按钮点击事件会触发 Event。可以理解为 Redux 中的 action，一般通过`enum`来表示事件。

```dart
enum CounterEvent { increment, decrement }
```

### States

States 是 Bloc 的状态表现，记录当前应用状态。与 Redux 中的 Store 类似。

### Transitions

从一种状态到另一种状态称为 Transitions。Transition 由当前 state、event 和下一个 state 构成。与 Redux 中的 Reducer 类似。

```dart
{
  "currentState": 0,$$
  "event": "CounterEvent.increment",
  "nextState": 1
}
```

### Streams

每一次`yield`的值都会作为进入`Stream`中的数据。

```dart
// 创建
Stream<int> countStream(int max) async* {
    for (int i = 0; i < max; i++) {
        yield i;
    }
}

// 使用
Future<int> sumStream(Stream<int> stream) async {
    int sum = 0;
    await for (int value in stream) {
        sum += value; // 从 Stream 中获取数据
    }
    return sum;
}
void main() async {
    /// Initialize a stream of integers 0-9
    Stream<int> stream = countStream(10);
    /// Compute the sum of the stream of integers
    int sum = await sumStream(stream);
    /// Print the sum
    print(sum); // 45
}
```

## Bloc

```dart
import 'package:bloc/bloc.dart';

// 声明了继承自 Bloc 的 CounterBloc，并且类型是将 CounterEvent 转化成 int
class CounterBloc extends Bloc<CounterEvent, int> {

  enum CounterEvent { increment, decrement }

  // 必须设置初始化值
  @override
  int get initialState => 0;

  // 必须声明 mapEventToState
  // 接受 event 类型参数
  @override
  Stream<int> mapEventToState(CounterEvent event) async* {
      switch (event) {
        case CounterEvent.decrement:
          yield currentState - 1;
          break;
        case CounterEvent.increment:
          yield currentState + 1;
          break;
      }
  }

  // 可以在 onTransition 中取到 transition 的值，
  @override
  void onTransition(Transition<CounterEvent, int> transition) {
      print(transition);
  }

  // Bloc 默认忽略报错，也可以在 onError 中处理报错
  @override
  void onError(Object error, StackTrace stackTrace) {
    print('$error, $stackTrace');
  }
}

void main() {
    CounterBloc bloc = CounterBloc();

    for (int i = 0; i < 3; i++) {
        bloc.dispatch(CounterEvent.increment); // Bloc 实例有 dispatch 方法，并在调用后触发 mapEventToState
    }
}
```
