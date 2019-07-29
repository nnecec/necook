# 起步之后

主要讨论下在了解一些基础语法，创建初始模版项目之后，一些开发体会。

## 文件结构

大多数项目按以下的命名去组织项目。

```
lib - src
  pages/screens = 页面
  widgets = components
  bloc/redux = 状态管理
  utils = 工具
  main.dart = 入口文件

pubspec.yaml = package.json
```

## 基本写法

main.dart -> Explore.dart

main.dart 定义了 App 的入口

```dart
import 'package:flutter/cupertino.dart';
import 'package:fluhub/screen/Explore.dart';

void main() {
  runApp(App());
}

class App extends StatefulWidget {
  @override
  State createState() => AppState();
}
class AppState extends State<App> {
  @override
  Widget build(BuildContext context) {
    return CupertinoApp(
      home: Explore(),
    );
  }
}
```

Explore.dart 中定义了一个继承自 StatefulWidget 的插件。在 dart 中，类似 React 有 StatefulWidget 和 StatelessWidget。

```dart
import 'package:flutter/cupertino.dart';

class Explore extends StatefulWidget {
  @override
  ExploreState createState() {
    return ExploreState();
  }
}

class ExploreState extends State<Explore> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController _usernameController;
  String username;
  String password;

  // 生命周期 初始化
  @override
  void initState() {
    super.initState();
    _usernameController = TextEditingController(text: 'nnecec');
  }

  // 生命周期 卸载该页面
  // 有某些需要卸载的 controller，如果方法实例需要在 dispose 卸载，文档中一般会有说明
  @override
  void dispose() {
    super.dispose();
    _usernameController.dispose();
    _formKey.currentState.dispose();
  }

  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        middle: Text('Explore'),
      ),
      child: SafeArea(// 将内容正确的现实在 navigationBar 之下
        child: Form(
          key: _formKey, // 根据 key 去调用对应的 Form
          child: Column(
            children: <Widget>[
              // username 输入框
              CupertinoTextField(
                placeholder: "Enter username",
                controller: _usernameController, // 使用 controller
              ),
              // 密码输入框
              CupertinoTextField(
                placeholder: "Enter password",
                obscureText: true, // 隐藏输入内容
                onChanged: (val) => setState(() => password = val), // 使用 state
              ),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 16.0),
                child: CupertinoButton(
                  color: CupertinoColors.activeBlue, // 按钮背景颜色
                  onPressed: () { // 点击事件
                    _formKey.currentState.save();
                    print(
                        'username: ${_usernameController.text}, password: $password'); // 控制台打印
                    showCupertinoDialog( // 弹出 Modal 
                      context: context,
                      builder: (BuildContext context) {
                        return CupertinoAlertDialog( // Modal 中的组件是一个 dialog
                          title: Text('result'),
                          content: Text(
                              'username: ${_usernameController.text}, password: $password'),
                          actions: <Widget>[
                            CupertinoActionSheetAction(
                              onPressed: () async {
                                Navigator.pop(context, 'confirm'); // 关闭对话框
                              },
                              child: Text('确定'),
                            ),
                          ],
                        );
                      },
                    );
                  },
                  child: Text('Submit'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

```

## 如何使用文档

访问 `docs.flutter.dev` 文档。

比如右上角搜索 CupertinoTextField。

标题下的第一部分是这个组件的一些说明概括，包括一些使用方法，如提到的 onChanged, controller 等。

部分组件会有 Sample 举例说明。

Constructors 下的是构造器的参数说明，即是组件接受的参数配置。

接下来 Properties 对参数进行详细说明。

Methods 则是该类具备的方法。

官方的组件可以在 https://flutter.dev/docs/development/ui/widgets 查看，仅仅有一个预览图。

文档现在是无法像 JavaScript 一样提供可在线预览的 Demo。

IOS 可以在商店下载一个 Flutter Go 的 APP，可以预览大部分的组件。
