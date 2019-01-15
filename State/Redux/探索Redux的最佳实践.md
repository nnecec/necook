# 探索Redux的最佳实践

作者 | 龚麒

编辑 | 尾尾

本文是广发证券高级前端工程师龚麒在前端之巅微信群中的分享整理总结而成。加群请关注前端之巅公众号并回复“加群”。

## 1. 前言

广发证券金钥匙是一个连接用户和投资顾问、为用户提供专业投资咨询服务的的产品。基于Angular 1.x和Ionic，我们为用户和投顾分别提供了覆盖PC Web、Mobile Web和Android/iOS客户端的系列产品。

前端的发展日新月异，React Native/Weex/微信小程序等技术方案进一步扩展了前端技术的应用范围。在金钥匙项目中，我们相继推出了小程序版金钥匙有问必答服务，同时采用React Native替代Ioinc，重构金钥匙项目客户端。这一过程中，对于在前端项目中如何优雅的管理应用中的数据状态进行了深入的思考。我们选择Redux作为应用状态管理工具，从多个角度探索其最佳实践，本文分享我们在探索过程中的一些总结。

## 2. 探索 Best Practice in Redux

在以往基于Angular 1.x的开发经验中，有几个问题总是出现在我脑海中

1. 应用的状态数据在哪里？
2. 应用当前状态数据是什么？
3. 怎样优雅的在组件间共享数据？

在Angular 1.x项目中我们没能很好的解决上述问题，在开始使用React Native重构项目时，迫切的希望解决上述问题，一番了解，我们选择了Redux。

### 2.1 什么是Redux

Redux是前端应用的状态容器，提供可预测的状态管理，其基本定义可以用下列公式表示

(state, action) => newState

![WechatIMG199](./img/WechatIMG199.jpeg)

### 2.2 Redux异步方案选型

Redux自身action结构简单，没有定义异步方法部分的支持内容。然而异步请求是前端应用中重要部分，如何管理异步请求，怎样在社区的各式异步相关中间件中选择，是首先需要解决的问题。

#### 2.2.1 Without Middleware

最初使用Redux时会有疑问，必须借助中间件才能完成异步请求吗？并不是这样，可以像下例中进行异步操作

```Javascript
//action creator
function loadData(dispatch,userId){
    dispatch({type:'LOAD_START'})
    asyncRequest(userId).then(resp=>{
        dispatch({type:'LOAD_SUCCESS',resp})
    }).catch(error=>{
        dispatch({type:'LOAD_FAIL',error})
    })
}

//component
componentDidMount(){
    loadData(this.props.dispatch,this.props.userId)
}
```

虽然上述代码示例可以完成工作，但是有下面几个问题

1. 组件需将dispatch/getState这种业务无关的参数，根据需要传入到action creator
2. 对包含异步逻辑的creator和对普通action的调用方法不一致
3. 带来组件和action creator在一定程度上的耦合

#### 2.2.2 Redux Thunk

Redux提供了中间件机制，而Redux Thunk是Redux官方文档中用到的异步组件，使用Redux-Thunk完成上述异步请求

```javascript
//action creator
function loadData(userId){
    return  dispatch => {
        dispatch({type:'LOAD_START'})
        asyncRequest(userId).then(resp=>{
            dispatch({type:'LOAD_SUCCESS',resp})
        }).catch(error=>{
            dispatch({type:'LOAD_FAIL',error})
        })
    }
}

//component
componentDidMount(){
    this.props.dispatch(loadData(this.props.userId));
}
```

相比不使用之前中间件，使用 redux-thunk后，在组件中不再关注 action creator 中是否需要 dispatch/getState 参数，不再关注dispatch的是异步还是同步的方法。

当使用中间件完成异步请求时，action在应用中流程如下所示

![WechatIMG208](./img/WechatIMG208.jpeg)

#### 2.2.3 Redux Promise Middleware

上例中采用Redux Thunk进行异步请求，这一个简单的请求过程，我们需要主动的触发请求的开始、成功和失败状态，当应用中有大量这类简单请求时，项目中会充满这种重复代码。

针对这一问题，可以采用Redux Promise Middleware来简化代码

```Javascript
//action creator
function loadData(userId){
    return {
        type:types.LOAD_DATA,
        payload:asyncRequest(userId)
    }
}

//component
componentDidMount(){
    this.props.dispatch(loadData(this.props.userId));
}
```

Redux Promise Middleware中间件会帮助我们处理异步请求的状态，为当前action type添加PEDNGING/FULFILLED/REJECTED三种状态，根据异步请求的结果触发不同状态。

Redux Promise Middleware中间件适用于简化简单请求的代码，开发中推荐混合使用Redux Promise Middleware中间件和Redux Thunk。

#### 2.2.4 Redux Saga

Redux Saga可以理解为一个和系统交互的常驻进程，其中，Saga可简单定义如下

Saga = Worker + Watcher

采用Redux Saga完成异步请求，示例如下

```Javascript
//saga
function* loadUserOnClick(){
    yield* takeLatest('LOAD_DATA',fetchUser); 
} 

function* fetchUser(action){
    try{
        yield put({type:'LOAD_START'});
        const user = yield call(asyncRequest,action.payload);
        yield put({type:'LOAD_SUCCESS',user});
    }catch(err){
        yield put({type:'LOAD_FAIL',error})
    }
}

//component
<div onclick={e=>dispatch({type:'LOAD_DATA',payload:'001'})}>load data</div>
```

相比Redux Thunk，使用Redux Saga有几处明显的变化

1. 在组件中，不再dispatch(action creator)，而是dispatch(pure action)
2. 组件中不再关注由谁来处理当前action，action经由root saga分发
3. 具体业务处理方法中，通过提供的call/put等帮助方法，声明式的进行方法调用
4. 使用ES6 Generator语法，简化异步代码语法

除开上述这些不同点，Redux Saga真正的威力，在于其提供了一系列帮助方法，使得对于各类事件可以进行更细粒度的控制，从而完成更加复杂的操作。

简单列举如下

1. 提供takeLatest/takeEvery/throttle方法，可以便利的实现对事件的仅关注最近事件、关注每一次、事件限频
2. 提供cancel/delay方法，可以便利的取消、延迟异步请求
3. 提供race(effects),[…effects]方法来支持竞态和并行场景
4. 提供channel机制支持外部事件

#### 2.2.5 Redux Observable

Redux Observable是基于RxJS的用于处理异步请求的中间件，可简单定义如下：

`Redux Observable = Epic( Type + Operators )`

Redux Observable关注Redux中的action，理念是action in ,action out。用Redux Observable完成异步请求示例如下

```javascript
//epic
const loadUserEpic = action$ => 
    action$.ofType('LOAD_DATA')
        .map(()=>({type:'LOAD_START'}))
        .mergeMap(action =>
          ajax.getJSON(`/api/users/${action.payload}`)
            .map(user => {type:'LOAD_SUCCESS',user})
            .catch(error => Observable.of({
                type: 'LOAD_FAIL',error
            }))
        );

//component
<div onclick={e=>dispatch({type:'LOAD_DATA',payload:'001'})}>load data</div>
```

借助RxJS的各种操作符和帮助方法，Redux Observable也能实现对各类事件的细粒度操作，比如取消、限频、延迟请求等。

Redux Observable与Redux Saga适用于对事件操作有细粒度需求的场景，同时他们也提供了更好的可测试性，当你的应用逐渐复杂需要更加强大的工具时，他们会成为很好的帮手。由于Redux Observable基于RxJS，相对来说学习曲线更高。

### 2.3 Redux应用状态划分

如何设计应用状态的数据结构是一个值得思考的问题，在实践中，我们总结了两点数据划分的指导性原则，应用状态扁平化和抽离公共状态。

#### 2.3.1 应用状态扁平化

在我们的项目中，有联系人、聊天消息和当前联系人对象。在Angular 1.x 项目中，数据结构如下

```javascript
{
contacts:[
    {
        id:'001',
        name:'zhangsan',
        messages:[
            {
                id:1,
                content:{
                    text:'hello'
                },
                status:'succ'
            }
        ]
    },
    {
        id:'002',
        name:'lisi',
        messages:[
            {
                id:2,
                content:{
                    text:'world'
                },
                status:'fail'   
            }
        ]
    }
],
selectedContact:{
        id:'001',
        name:'zhangsan',
        messages:[
            {
                id:1,
                content:{
                    text:'hello'
                },
                status:'succ'
            }
        ]
    }
}
```

采用上述数据机构，带来几个问题

1. 消息对象与联系人对象耦合，消息对象的变更操作引发联系人对象的变更操作
2. 联系人集合和当前联系人对象数据冗余，当数据更新时需要多处修改来保持数据一致性
3. 数据结构嵌套过深，不便于数据更新，一定程度上导致更新时的耗时增加

将数据扁平化、解除耦合，得到如下数据结构

```Javascript
{
contacts:[
    {
        id:'001',
        name:'zhangsan'
    },
    {
        id:'002',
        name:'lisi'
    }
],
messages:{
    '001':[
        {
           id:1,
           content:{
               text:'hello'
           },
           status:'succ'
       },
       ...
    ],
    '002':[
        {
           id:3,
           content:{
               text:'haha'
           },
           status:'succ'
       }
    ]
},
selectedContactId:'001'
}
```

相对于之前的问题，上述数据结构具有以下优点

1. 细粒度的更新数据,进而精细控制视图的渲染
2. 结构清晰,避免更新数据时,复杂的数据操作
3. 去除冗余数据，避免数据不一致

#### 2.3.2 抽离公共状态

在领域对象之外，往往还有另外一些与请求过程相关的状态数据，如下所示

```Javascript
{
  user: {
    isError: false, // 加载用户信息失败
    isLoading: false, // 加载用户中
    ...
    entity: { ... },
  },
  messages: {
    isLoading: true, // 加载消息中
    nextHref: '/api/messages?offset=200&size=100', // 消息分页数据
    ...
    entities: { ... },
  },
  authors: {
    isError: false, // 加载作者失败
    isLoading: false, // 加载作者中
    nextHref: '/api/authors?offset=50&size=25', // 作者分页数据
    ...
    entities: { ... },
  },
}
```



上述数据结构中，我们按照功能模块将状态数据内聚。

采用上述结构，会导致我们需要写很多基本重复的action，如下所示

```Javascript
{
  type: 'USER_FETCH_ERROR',
  payload: {
    isError,
  },
}

{
  type: 'USER_IS_LOADING',
  payload: {
    isLoading,
  },
}

{
  type: 'MESSAGES_IS_LOADING',
  payload: {
    isLoading,
  },
}

{
  type: 'MESSAGES_NEXT_HREF',
  payload: {
    nextHref,
  },
}

{
  type: 'AUTHORS_FETCH_ERROR',
  payload: {
    isError,
  },
}

{
  type: 'AUTHORS_IS_LOADING',
  payload: {
    isLoading,
  },
}
...
```

我们分别为user、message、author定义了一系列action，而他们作用类似，代码重复。

为解决这一问题，我们可以将这类状态数据抽离，不再简单的按照功能模块内聚，抽离后的状态数据如下所示

```Javascript
{
  isLoading: {
    user: false,
    messages: true,
    authors: false,
    ...
  },
  isError: {
    userEdit: false,
    authorsFetch: false,
    ...
  },
  nextHref: {
    messages: '/api/messages?offset=200&size=100',
    authors: '/api/authors?offset=50&size=25',
    ...
  },
  user: {
    ...
    entity: { ... },
  },
  messages: {
    ...
    entities: { ... },
  },
  authors: {
    ...
    entities: { ... },
  },
}
```



采用这一结构，可以避免定义大量相似的action type，编写重复的action。

### 2.4 如何修改应用状态

将应用状态数据不可变化是使用Redux的一般范式，有多种方式可以实现不可变数据的效果，这里我们分别尝试了Object.assign、Immutable.js和Seamless-Immutable.js。

#### 2.4.1 Object.assign/Spread Operator

最初我们使用Object.assign或者Spread Operator来修改数据，在Reducer中使用Spread Operator修改数据的简单示例如下

```Javascript
function todoApp(state = initialState ,action){
    switch (action.type){
        case SET_VISIBILITY_FILTER:
            return {...state,visibilityFilter: action.filter}
        default:
            return state;
    }
}
```

随着使用的深入，发现这一方式有如下问题

1. 不能方便的进行嵌套数据的更新
2. 引用类型数据的浅复制可能带来意外的问题
3. 非强制，你仍然有机会直接修改状态数据

#### 2.4.2 Immutable.js

带着上述问题，我们了解到Immutable.js并开始使用它进行应用状态数据的修改。

Immutable.js为人称道的是它的基于共享数据结构、而非深度复制所带来的数据修改时的高性能，但是在我们的使用过程中，发现其易用性不够友好，使用体验并不美好。

首先，Immutable.js实现的是shallowly immutable，如下示例中，notFullyImmutable中的对象属性仍然是可变的

```javascript
var obj = {foo: "original"};
var notFullyImmutable = Immutable.List.of(obj);

notFullyImmutable.get(0) // { foo: 'original' }

obj.foo = "mutated!";

notFullyImmutable.get(0) // { foo: 'mutated!' }
```

另外，Immutable.js使用了自定义的数据结构，这意味着贯穿我们的应用都需要明确当前使用的是Immutable.js的数据结构。需要获取数据时，需要使用提供的get方法，而不能使用obj.prop或者obj[prop]。而需要将数据同外部交互，如存储或者请求时，需要将特有数据结构转换成原生JavasScript对象。

最后，以state.set('key',obj)形式更新状态时，obj不能自动的immutable化。

#### 2.4.3 Seamless-Immutable.js

前面提到的使用Immutable.js过程中的问题，使得我们在开发中不断的需要停下来思考当前写法是否正确，于是我们继续尝试，最后选择使用Seamless-Immutable.js来帮助实现不可变数据。

Seamless-Immutable.js意为无缝的Immutable，与Immutable.js不同，他没有自定义新的数据结构，其基本使用如下所示

```Javascript
var array = Immutable(["totally", "immutable", {hammer: "Can’t Touch This"}]);

array[1] = "I'm going to mutate you!"
array[1] // "immutable"

array[2].hammer = "hm, surely I can mutate this nested object..."
array[2].hammer // "Can’t Touch This"

for (var index in array) { console.log(array[index]); }
// "totally"
// "immutable"
// { hammer: 'Can’t Touch This' }

JSON.stringify(array) // '["totally","immutable",{"hammer":"Can’t Touch This"}]'
```

根据我们的使用体验，Seamless-Immutable.js易用性优于Immutable.js。但是在选择使用他之前，有一点需要了解的是，在数据修改时，Seamless-Immutable.js性能低于Immutable.js，当数据嵌套层级越深，数据量越大，性能差异越明显。所以这里需要根据业务特点来做选择，我们的业务没有大批量的深度数据修改需求，所以易用性比性能更重要。

### 2.5 组织Redux代码结构

学习使用Redux过程中，通常我们会将Redux几个主要元素按类型划分文件目录，通常我们按照如下方式组织代码文件

```Markdown
|--components/
|--constants/
 ----userTypes.js
|--reducers/
 ----userReducer.js
|--actions/
 ----userAction.js
```

严格遵循这一模式并无不可，不过在有些场景下，使用其他模式组织代码结构可能更加灵活、便利。

#### 2.5.1 Redux Ducks

通常我们的action与reducer都是一一对应，同时也会共用一个action type，于是会有一个很自然的想法，与其将action、reducer和type分离在各自目标的单独文件，为什么不将他们合并到一起呢？

合并后的userRedux被称为Redux Duck，这是经典的鸭子类型的应用。

合并后的代码示例如下

```javascript
//types
const LOAD   = 'LOAD';
const CREATE = 'CREATE';
const UPDATE = 'UPDATE';
const REMOVE = 'REMOVE';

//reducer
export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        // do reducer stuff
        default: return state;
    }
}

//action
export function loadUser() {
    return { type: LOAD };
}

export function createUser(data) {
    return { type: CREATE, data };
}

export function updateUser(data) {
    return { type: UPDATE, data };
}

export function removeUser(data) {
    return { type: REMOVE, data };
}
```

#### 2.5.2 按模块组织文件

随着项目规模的增长，代码文件逐渐增多，当actions目录下文件越来越多时，找到目标文件变成了一个稍显麻烦的事情。在这种场景下，按模块组织代码文件，将模块相关的代码聚合在一起，更加适合大型项目的开发。

```
|--modules/
 ----users/
 ------userComponent.js
 ------userRedux.js
 ----messages/
 ------messageComponent.js
 ------messageRedux.js
```

与此同时，根据我们的使用经验，鸭子模式与传统模式应当灵活的混合使用。当业务逻辑复杂，action与reducer各自代码量较多时，按照传统模式拆分可能是更好的选择。此时可以如下混合使用两种模式

```
|--modules/
 ----users/
 ------userComponent.js
 ------userConstant.js
 ------userAction.js
 ------userReducer.js
 ----messages/
 ------messageComponent.js
 ------messageRedux.js
```

## 3. 总结

随着对Redux使用的逐渐深入，我们对Redux几个主要内容的最佳实践进行了一番探索，最终形成了以下几点经验，作为我们现在的指导性原则

1. 一般项目中，使用Redux Thunk处理异步请求
2. 混合使用Redux Promise Middleware和Redux Thunk简化代码
3. 对于需要细粒度处理事件操作的业务，使用Redux Saga
4. 将应用状态数据扁平化
5. 抽离应用状态中公共的状态数据
6. 在性能不是最高优先级的场景下，使用Seamless-Immutable.js
7. 在大型项目中，按模块组织代码文件
8. 混合使用Redux Duck模式和传统模式



## Q&A

问：为什么不在componentDidMount直接发起ajax请求，而用redux管理？

答：像在最初提到的，在原Angular 1.x项目中，总是会被如下问题打断思考

1. 应用的状态数据在哪里？
2. 应用当前状态数据是什么？
3. 怎样优雅的在组件间共享数据？

直接在组件中进行异步请求、处理状态数据，当应用规模稍大，必然会遇到上述问题。与此同时，在组件中耦合业务逻辑，更容易使得代码难以维护，在一个多人参与的正式项目中，应该避免这种情况的发生。

----

问：Seamless-Immutable.js 与deepClone 有什么区别，为啥不能在需要的时候直接用deepClone，不需要的时候用object.assign?

答：简单来说，采用类Immutable.js工具，可以强制性的使得具备不可变特征，即当你在action creator或者component中试图修改这其数据时，是不会生效甚至报错的。同时，引入这类工具，可以使得团队开发中，大家遵循共同的范式。而deepClone/object.assign用在reducer中，并不能保证数据的不可变性，对开发人员也不具备强制性。

----

问：为啥用上了yield之类的语法，也不用更清晰的async await语法？

答：yield/generator是引入redux-saga中间件带入的，如倾向使用async await，当然也是可以的，并不互斥。

----

问：使用Redux和直接用React的State有什么实际分别呢？感觉React的State就已经足够？

答：开始React的学习应当从setState入手，当逐渐参与更加复杂的项目，会逐步感受到分享最初提到的一些问题，此时是考虑引入其他帮助工具的时机。

----

问：企业业务系统类项目是否使用redux-thunk，与object.assign就能满足？

答:需要视业务场景来定。一般说来，异步处理可以搭配使用redux-thunk和redux promise middleware，对状态数据建议引入seamless-immutable。当对异步请求和交互操作有更细粒度的控制需求时，可以考虑引入redux-saga。

---

问：使用redux需要对数据模块进行良好的设计才能达到较好的效果，那在敏捷开发过程中，如何才能更好地进行设计呢，有什么经验或者思想可以跟我们分享？

问：是否应当把业务中全部数据放入redux中？如果不是，请问应当怎么划分？

答：最初使用redux时，可能有几个容易走进的误区。

1. 将应用中所有数据全部放入redux中
2. 完全按照应用界面设计状态数据的结构，一个界面内所有数据作为一个模块

像在分享中提到的，我们在设计状态数据时，会按照下面几个范式设计

1. 按领域对象设计状态数据结构
2. 对象扁平化，避免冗余数据
3. 将请求过程相关的状态数据抽离为公共状态
4. redux中仅保存基础的数据
5. 在selector中根据视图需求，将基础数据组合成视图数据
6. UI相关的数据，如控制modal的展示与否、输入文本框的中间状态，保存在当前组件state中，即结合使用组件的state和redux