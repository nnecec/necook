/**
 * 
 * 插入排序是一种简单的排序算法，一次构建一个项目的最终排序数组(或列表)。
 * 与快速排序、堆排序或合并排序等更高级的算法相比，它在大型列表中的效率要低得多。
 * 
 * 从第一位开始遍历列表并排序，在开始下一位时，与已排序的列表再次比较
 * 
 * 复杂度
 * 
 * Best Average Worst Memory	Stable	Comments
 * n    n2      n2    1       Yes	
 * 
 */
import Comparator from '../utils/comparator'


function insertionSort(originalArray, comparatorCallback?) {
  const comparator = new Comparator(comparatorCallback)

  for (let i = 0; i < originalArray.length; i++) { // 从 0 开始遍历列表
    for (let j = i; j >= 0; j--) { // 将 i+1 位的 与 i 之前的已排序列表比较
      if (comparator.lessThan(originalArray[j + 1], originalArray[j])) { // 遇到 i+1 小于 i 的则交换位置
        const cache = originalArray[j + 1];
        originalArray[j + 1] = originalArray[j];
        originalArray[j] = cache;
      }
    }
  }
  return originalArray
}

// console.log(insertionSort([6, 5, 3, 1, 8, 7, 2, 4]))