/**
 * 希尔排序，是一种就地比较排序。
 * 它可以被看作是交换排序(气泡排序)或插入排序(插入排序)的概括。
 * 该方法首先对彼此相距很远的元素对进行排序，然后逐渐减小要比较的元素之间的间隙。
 * 从相距很远的元素开始，它可以比简单的最近邻居交换更快地将一些不合适的元素移动到位。
 * 
 * 如每间隔4个合为一个子列表对比交换，再到间隔3个对比到间隔1个。子队列的排序用插入排序实现。
 * 
 * 复杂度
 * 
 * Best     Average                   Worst       Memory	Stable	Comments
 * nlog(n)	depends on gap sequence	  n(log(n))2	1	      No	
 * 
 */
import Comparator from '../utils/comparator'


function shellSort(originalArray, comparatorCallback?) {
  const comparator = new Comparator(comparatorCallback)

  let gap = Math.floor(originalArray.length / 2)

  while (gap > 0) {
    // 
    for (let i = 0; i < (originalArray.length - gap); i += 1) {
      let current = i;
      let gapShiftedIndex = i + gap;

      while (current >= 0) {
        // Call visiting callback.

        // 将第 i 个 与 i+gap 对比并排序
        if (comparator.lessThan(originalArray[gapShiftedIndex], originalArray[current])) {
          const tmp = originalArray[current];
          originalArray[current] = originalArray[gapShiftedIndex];
          originalArray[gapShiftedIndex] = tmp;
        }

        // 如果 子列表还有没比对过的值
        gapShiftedIndex = current;
        current -= gap;
      }
    }

    // 缩小间距 gap
    gap = Math.floor(gap / 2);
  }

  return originalArray
}

console.log(shellSort([15, 8, 5, 12, 10, 1, 16, 9, 11, 7, 20, 3, 2, 6, 17, 18, 4, 13, 14, 19]))