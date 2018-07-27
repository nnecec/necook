/**
 * 
 * 快速排序是一种分而治之的算法。
 * 快速排序首先将一个大数组分成两个较小的子数组:低元素和高元素。
 * 然后快速排序可以递归地对子数组排序 这些步骤是: 从数组中选择一个元素，称为枢轴。 
 * 分区:对数组重新排序，使所有值小于轴的元素位于轴之前，而所有值大于轴的元素位于轴之后(两者的值相等)。
 * 分区后，枢轴处于其最终位置。这称为分区操作。 
 * 递归地将上述步骤应用于具有较小值的元素子阵列，并分别应用于具有较大值的元素子阵列。 
 * 快速排序算法的动画可视化。水平线是轴值。
 * 
 * 复杂度
 * 
 * Best     Average  Worst  Memory	Stable	Comments
 * nlog(n)  nlog(n)	 n2	    log(n)	No	    快速排序通常使用O(log(n))堆栈空间就地完成
 * 
 */
import Comparator from '../utils/comparator'


function quickSort(originalArray, comparatorCallback?) {
  const comparator = new Comparator(comparatorCallback)

  if (originalArray.length <= 1) return originalArray

  // 初始化 左、右、中列表
  const leftArray = [], rightArray = []
  const centerElement = originalArray.shift()
  const centerArray = [centerElement]

  while (originalArray.length) {
    const currentElement = originalArray.shift() // 取原数组第一个值 与 中间值比较

    if (comparator.equal(currentElement, centerElement)) { // 针对大于、小于、等于的情况存入不同数组
      centerArray.push(currentElement)
    } else if (comparator.lessThan(currentElement, centerElement)) {
      leftArray.push(currentElement)
    } else {
      rightArray.push(currentElement)
    }
  }

  // 再次处理 left 及 right 数组
  const leftArraySorted = quickSort(leftArray)
  const rightArraySorted = quickSort(rightArray)

  return leftArraySorted.concat(centerArray, rightArraySorted)

}

// console.log(quickSort([15, 8, 5, 12, 10, 1, 16, 9, 11, 7, 20, 3, 2, 6, 17, 18, 4, 13, 14, 19]))