# Event Loop

## 浏览器中的事件循环

JavaScript 是门非阻塞单线程语言，JavaScript 在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入到 Task（有多种 Task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JavaScript 中的异步还是同步行为。

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（micro task） 和 宏任务（macro task）。在 ES6 规范中，micro task 称为 jobs，macro task 称为 task。

微任务包括 `process.nextTick` ，`promise` ，`Object.observe` ，`MutationObserver`

宏任务包括 `script`(主程序代码) ， `setTimeout` ，`setInterval` ，`setImmediate` ，I/O ，UI rendering

`promise` 优先于 `setTimeout`, micro-task 和 macro-task

一次正确的 Event Loop 顺序是：

1. 执行同步代码，这属于宏任务
2. 执行栈为空，查询是否有微任务需要执行
3. 执行所有微任务
4. 必要的话渲染 UI
5. 然后开始下一轮 Event loop，执行宏任务中的异步代码

由此我们得到的执行顺序应该为：`script` —> `process.nextTick` —> `Promises` —> `setTimeout` —> `setInterval` —> `setImmediate` —> I/O —> UI rendering

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

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──   │ connections   │
│  └──────────┬────────────┘      │ data, etc.    │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
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

如果有 setImmediate 需要执行，poll 阶段会停止并且进入到 check 阶段执行 setImmediate
如果没有 setImmediate 需要执行，会等待回调被加入到队列中并立即执行回调
但当二者在异步i/o callback内部调用时，总是先执行setImmediate，再执行setTimeout

**check** 阶段执行 setImmediate

**close callbacks** 阶段执行 close 事件

并且在 Node 中，有些情况下的定时器执行顺序是随机的

上面介绍的都是 macrotask 的执行情况，microtask 会在以上每个阶段完成后立即执行。Node 中的 process.nextTick 会先于其他 microtask 执行。process.nextTick()不在event loop的任何阶段执行，而是在各个阶段切换的中间执行,即从一个阶段切换到下个阶段前执行。

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