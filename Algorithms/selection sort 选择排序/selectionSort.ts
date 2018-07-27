/**
 * Complexity
 * 
 * Best Average Worst Memory	Stable	Comments
 * n2   n2      n2    1       No
 * 
 */
import Comparator from '../utils/comparator'


function selectionSort(originalArray, comparatorCallback?) {
  const comparator = new Comparator(comparatorCallback)

  for (let i = 0; i < originalArray.length; i++) {
    let minFlag = i // 假设第 i 个为最小值

    for (let j = i + 1; j < originalArray.length; j++) { // 在该 i 后查找是否有小于 i 的
      if (comparator.lessThan(originalArray[j], originalArray[minFlag])) { // 如果遇到小于第 i 个的值，则将 min 设为该 j
        minFlag = j
      }
    }

    if (minFlag !== i) { // 如果 min 与 i 不一致 则将两者对换 
      const cache = originalArray[i]
      originalArray[i] = originalArray[minFlag]
      originalArray[minFlag] = cache
    }
  }
  // 得到从 0 到最后一位逐位冒泡的排序数据
  return originalArray
}

// console.log(selectionSort([8, 5, 2, 6, 9, 3, 5, 4, 8, 7]))