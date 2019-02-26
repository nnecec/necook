# virtual

`schema.virtual(data).get(()=>{})`可以设置以`data`为key值获取get()返回的值

```javascript
Schema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});
```

同样具有`set()`方法可以设置

```javascript
personSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});

...

mad.name.full = 'Breaking Bad';
console.log(mad.name.first); // Breaking
console.log(mad.name.last);  // Bad
```