# Event Loop

## 浏览器中的事件循环

JavaScript 是门非阻塞单线程语言，JavaScript 在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入到 Task（有多种 Task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JavaScript 中的异步还是同步行为。

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（micro task） 和 宏任务（macro task）。在 ES6 规范中，micro task 称为 jobs，macro task 称为 task。

微任务包括 `process.nextTick` ，`promise` ，`Object.observe` ，`MutationObserver`

宏任务包括 `script`(主程序代码) ， `setTimeout` ，`setInterval` ，`setImmediate` ，`requestAnimationFrame` ， I/O

`promise` 优先于 `setTimeout`, micro-task 和 macro-task

一次正确的 Event Loop 顺序是：

1. 执行同步代码，这属于宏任务
2. 执行栈为空，查询是否有微任务需要执行
3. 执行所有微任务
4. 必要的话渲染 UI
5. 然后开始下一轮 Event loop，执行宏任务中的异步代码

由此我们得到的执行顺序应该为：`script` —> `process.nextTick` —> `Promises` —> `setTimeout` —> `setInterval` —> `setImmediate` —> I/O 

如果宏任务中的异步代码有大量的计算并且需要操作 DOM 的话，为了更快的 界面响应，我们可以把操作 DOM 放入微任务中。

### Example

```javascript
async function async1(){
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2(){
  console.log('async2')
}

console.log('script start')

setTimeout(function(){
  console.log('setTimeout')
},0)  

async1();

new promise(function(resolve){
  console.log('promise1')
  resolve();
}).then(function(){
  console.log('promise2')
})

console.log('script end')

/*
script start
async1 start
async2
promise1
script end
promise2
async1 end
setTimeout
**/
```

## Node 中的事件循环

Node 的 Event loop 分为6个阶段，它们会按照顺序反复运行

这里的每一个阶段都对应着一个事件队列

- 每当event loop执行到某个阶段时，都会执行对应的事件队列中的事件，依次执行
- 当该队列执行完毕或者执行数量超过上限，event loop就会执行下一个阶段
- 每当event loop切换一个执行队列时，就会去清空microtasks queues，然后再切换到下个队列去执行，如此反复

```
   ┌──────────────────────┐
┌─>│        timers        │
│  └──────────┬───────────┘
│  ┌──────────┴───────────┐
│  │     I/O callbacks    │
│  └──────────┬───────────┘
│  ┌──────────┴───────────┐
│  │     idle, prepare    │
│  └──────────┬───────────┘      ┌───────────────┐
│  ┌──────────┴───────────┐      │   incoming:   │
│  │         poll         │ <──  │ connections   │
│  └──────────┬───────────┘      │ data, etc.    │
│  ┌──────────┴───────────┐      └───────────────┘
│  │        check         │
│  └──────────┬───────────┘
│  ┌──────────┴───────────┐
└──┤    close callbacks   │
   └──────────────────────┘
```

**timers** 执行 setTimeout 和 setInterval
一个 timer 指定的时间并不是准确时间，而是在达到这个时间后尽快执行回调，可能会因为系统正在执行别的事务而延迟。
下限的时间有一个范围：[1, 2147483647] ，如果设定的时间不在这个范围，将被设置为1。

**I/O** 处理网络、流、tcp 的错误 callback，会执行除了 close 事件，定时器和 setImmediate 的回调

**idle, prepare** node 内部实现

**poll** 这一阶段中，系统会做两件事情

1. 执行到点的定时器
2. 执行 poll 队列中的事件

并且当 poll 中没有定时器的情况下，会发现以下两件事情

如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者系统限制

如果 poll 队列为空，会有两件事发生

如果有 `setImmediate` 需要执行，poll 阶段会停止并且进入到 check 阶段执行 `setImmediate`
如果没有 `setImmediate` 需要执行，会等待回调被加入到队列中并立即执行回调
但当二者在异步 i/o callback 内部调用时，总是先执行`setImmediate`，再执行 `setTimeout`

**check** 阶段执行 `setImmediate`

**close callbacks** 阶段执行 close 事件

并且在 Node 中，有些情况下的定时器执行顺序是随机的

上面介绍的都是 macro task 的执行情况，micro task 会在以上每个阶段完成后立即执行。Node 中的 `process.nextTick` 会先于其他 micro task 执行。`process.nextTick()`不在 event loop 的任何阶段执行，而是在各个阶段切换的中间执行,即从一个阶段切换到下个阶段前执行。

### Example

---

```javascript
setTimeout(()=>{
    console.log('timer1')

    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)

setTimeout(()=>{
    console.log('timer2')

    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)

// 以上代码在浏览器和 node 中打印情况是不同的
// 浏览器中打印 timer1, promise1, timer2, promise2
// node 中打印 timer1, timer2, promise1, promise2
```


> 题目 https://juejin.im/post/5af800fe518825429c594f92

```javascript
const first = () => (new Promise((resolve,reject)=>{
    console.log(3);
    let p = new Promise((resolve, reject)=>{
         console.log(7);
        setTimeout(()=>{
           console.log(5);
           resolve(6); 
        },0)
        resolve(1);
    }); 
    resolve(2);
    p.then((arg)=>{
        console.log(arg);
    });

}));

first().then((arg)=>{
    console.log(arg);
});
console.log(4);
```

1. 第一轮事件循环：先执行宏任务，主script ，new Promise立即执行，输出【3】，执行p这个new Promise 操作，输出【7】，发现setTimeout，将回调放入下一轮任务队列（Event Queue），p的then，姑且叫做then1，放入微任务队列，发现first的then，叫then2，放入微任务队列。执行console.log(4)，输出【4】,宏任务执行结束。
再执行微任务，执行then1，输出【1】，执行then2，输出【2】。到此为止，第一轮事件循环结束。开始执行第二轮。

2. 第二轮事件循环：先执行宏任务里面的，也就是setTimeout的回调，输出【5】。resovle不会生效，因为p这个Promise的状态一旦改变就不会在改变了。 所以最终的输出顺序是3、7、4、1、2、5。


```javascript
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

new Promise((resolve) => {
    console.log('Promise')
    resolve()
}).then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
// script start => Promise => script end => promise1 => promise2 => setTimeout
```

```javascript
setImmediate(()=>{
  console.log('setImmediate1')
  setTimeout(()=>{
    console.log('setTimeout1')    
  },0)
})
setTimeout(()=>{
  console.log('setTimeout2') 
  process.nextTick(()=>{console.log('nextTick1')})
  setImmediate(()=>{
    console.log('setImmediate2')
  })
},0)
/**
首先我们可以看到上面的代码先执行的是setImmediate1,此时event loop在check队列
然后setImmediate1从队列取出之后，输出setImmediate1，然后会将setTimeout1执行
此时event loop执行完check队列之后，开始往下移动，接下来执行的是timers队列
这里会有问题，我们都知道setTimeout1设置延迟为0的话，其实还是有4ms的延迟，那么这里就会有两种情况。先说第一种，此时setTimeout1已经执行完毕

根据node事件环的规则，我们会执行完所有的事件，即取出timers队列中的setTimeout2,setTimeout1
此时根据队列先进先出规则，输出顺序为setTimeout2,setTimeout1，在取出setTimeout2时，会将一个process.nextTick执行（执行完了就会被放入微任务队列），再将一个setImmediate执行（执行完了就会被放入check队列）
到这一步，event loop会再去寻找下个事件队列，此时event loop会发现微任务队列有事件process.nextTick，就会去清空它，输出nextTick1
最后event loop找到下个有事件的队列check队列，执行setImmediate，输出setImmediate2


假如这里setTimeout1还未执行完毕（4ms耽误了它的终身大事？）

此时event loop找到timers队列，取出*timers队列**中的setTimeout2，输出setTimeout2，把process.nextTick执行，再把setImmediate执行
然后event loop需要去找下一个事件队列，这里大家要注意一下，这里会发生2步操作，1、setTimeout1执行完了，放入timers队列。2、找到微任务队列清空。，所以此时会先输出nextTick1
接下来event loop会找到check队列，取出里面已经执行完的setImmediate2
最后event loop找到timers队列，取出执行完的setTimeout1。这种情况下event loop比上面要多切换一次



所以有两种答案

setImmediate1,setTimeout2,setTimeout1,nextTick1,setImmediate2
setImmediate1,setTimeout2,nextTick1,setImmediate2,setTimeout1
*/
```

## reference

1. [node基础面试事件环？微任务、宏任务？](https://juejin.im/post/5b35cdfa51882574c020d685)