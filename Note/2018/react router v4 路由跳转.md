在组件内部想跳转到一个外部写的Route路由，结果怎么都跳不过去，url变了但是页面没有render。

solution

https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md

```javascript
// redux before
const MyConnectedComponent = connect(mapStateToProps)(MyComponent)
// redux after
const MyConnectedComponent = withRouter(connect(mapStateToProps)(MyComponent))

// mobx before
const MyConnectedComponent = observer(MyComponent)
// mobx after
const MyConnectedComponent = withRouter(observer(MyComponent))
```

之前插了一些stackoverflow的回答 也是说要加withRouter。但是问题是 withRouter 应该在状态管理的外层，在mobx中就是 

```javascript
...
@withRouter
@observer
class Demo extends React.Component{

}
...
```
