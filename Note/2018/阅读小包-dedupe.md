# dedupe

> [link](https://github.com/seriousManual/dedupe)
> 从数组中移除重复的项

```javascript
function dedupe (client, hasher) {
    hasher = hasher || JSON.stringify

    const clone = []
    const lookup = {}

    for (let i = 0; i < client.length; i++) {
        let elem = client[i]
        let hashed = hasher(elem)

        if (!lookup[hashed]) {
            clone.push(elem)
            lookup[hashed] = true
        }
    }

    return clone
}
```

使用 hasher 后的值作为 key，去存储 client 中的值。如果 key 对应的值为空，则说明没有重复的值，将该值存入 clone。最后返回 clone。

hasher 默认为 `JSON.stringify`，或指定需要过滤的值 key。