/**
 * 
 * 冒泡排序，又被称为下沉排序
 * 它反复遍历要排序的列表，比较每对相邻项目，如果顺序错误，则交换它们。
 * 循环列表，直到不需要交换，这表示列表已经排序。
 * 
 * 复杂度
 * 
 * Best Average Worst Memory	Stable	Comments
 * n    n2      n2    1       Yes	
 * 
 */
import Comparator from '../utils/comparator'

/**
 * 冒泡排序
 *
 * @param {*} originalArray
 * @param {*} [comparatorCallback]
 * @returns
 */
function bubbleSort(originalArray, comparatorCallback?) {
  const comparator = new Comparator(comparatorCallback)

  for (let i = 0; i < originalArray.length; i++) { // 循环整个数组
    for (let j = 0; j < originalArray.length; j++) { // 冒泡第 j 个元素
      if (comparator.lessThan(originalArray[j + 1], originalArray[j])) { // 如果 前一个元素 比 后一个元素大 则冒泡

        const cache = originalArray[j + 1]
        originalArray[j + 1] = originalArray[j]
        originalArray[j] = cache
      }
    }
  }

  return originalArray
}