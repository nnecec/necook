1. 

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<script>
  setTimeout(() => {
    console.log('setTimeout', document.body);
  }, 0)
  Promise.resolve().then(() => {
    console.log('promise', document.body);
  })
  console.log(document.body)
</script>

</head>
<body>

</body>
</html>

2. 
new Observer(1).next(val => val + 1).next(console.log);

new Observer(0).next(val => {
  throw new Error('err');
}).next(val => {
  console.log('should not exec');
  return 2 * val;
}).catch(console.log)

3.
for of vs for in 

for (let i of { a: 1 }) {
    
}

a : 1 -> 2
useEffect(() => {
    console.log(a)
    return () => { console.log(a) }
}, [a])

useCallback hooks

const foo = () => {}



4. 
function useInterval(callback, delay) {
    
}
function App(props) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count + 1);
  }, props.delay);
  return count;
}

5.
line-height: 100%, line-height: 1

z-index: 1

position: relative;

margin border padding content

5.
hooks实现class component中 this.setState(value, () => {// after setState })的回调监听？  

题目：实现一个useMyState

const [value, setValue] = useMyState(0);

setValue(1, (v) => {console.log(v)} // 1

6.
帮实现useReducer / useState


const [value, setValue] = useState(0);

setValue(10);

7.
useMemo实现useCallback

9.
 写一个加法函数sum，支持sum(1)(2)(3,4)(5,6,7....) 

console.log(sum(1,2,3)(4)()) => 输出 10