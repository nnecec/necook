# ReactFiberExpirationTime

## computeInteractiveExpiration/computeAsyncExpiration

`computeExpirationBucket`的加壳方法，区别在于 PRIORITY_EXPIRATION 和 PRIORITY_BATCH_SIZE 一个是高优先级，一个是低优先级。

返回 UserBlockingPriority 优先级的过期时间

```javascript
export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

export const LOW_PRIORITY_EXPIRATION = 5000;
export const LOW_PRIORITY_BATCH_SIZE = 250;


computeExpirationBucket(currentTime, PRIORITY_EXPIRATION, PRIORITY_BATCH_SIZE);
```

## computeExpirationBucket

```javascript
const UNIT_SIZE = 10;

// num = MAX -currentTIme + 50  precision = 10
function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}

//HIGH: MAX - (((MAX - currentTime + 150/10 ) / 10 | 0 ) + 1) * 10
//LOW:  MAX - (((MAX - currentTime + 5000/10 ) / 25 | 0 ) + 1) * 25

function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET -
    ceiling(
      MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}
```