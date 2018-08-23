# React 16 useful new features

> [React 16.0–16.4 new features for every day use](https://hackernoon.com/react-16-0-16-3-new-features-for-every-day-use-f397da374acf)

## 返回多个元素

使用数组返回多个元素而不用使用一个外层元素作为容器

```javascript
const Breakfast = () => [
  <li key="coffee">Coffee</li>,
  <li key="croissant">Croissant</li>,
  <li key="marmalade">Marmalade</li>
];
```

使用`React.Fragment`

```javascript
const Breakfast = () => (
  <React.Fragment>
    <li>Coffee</li>
    <li>Croissant</li>
    <li>Marmalade</li>
  </React.Fragment>
);

// 简写
const Breakfast = () => (
  <>
    <li>Coffee</li>
    <li>Croissant</li>
    <li>Marmalade</li>
  </>
);
```

## 直接返回字符串或数字

函数可以直接返回字符串或数字作为元素显示

```javascript
const LocalDate = ({ date }) =>
  date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
```

## 取消 setState() 来避免重新渲染

在`setState()`的回调中返回`null`来取消

```javascript
handleChange = event => {
  const city = event.target.value;
  this.setState(
    prevState => (prevState.city !== city ? { city } : null)
  );
};
```

## getDerivedStateFromProps

替代`componentWillReceiveProps()`。返回值为`null`或者新的 state

## other new features

- error boundaries
- portals
- forwarding refs
- context
- getSnapshotBeforeUpdate()
- pointer events