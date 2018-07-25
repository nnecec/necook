import Comparator from '../utils/comparator'
/**
 *二分法查找
 *
 * @param {*} sortedArray
 * @param {*} seekElement
 * @param {*} comparatorCallback
 */
function binarySearch(sortedArray, seekElement, comparatorCallback) {
  const comparator = new Comparator(comparatorCallback)

  let start = 0
  let end = sortedArray.length - 1

  while (start < end) {
    const middle = start + Math.floor((end - start) / 2)


    // 如果找到符合 seek 的元素则返回
    if (comparator.equal(sortedArray[middle], seekElement)) {
      return middle
    }

    // 如果中间值 小于 seekElement 则说明在比中间值更大的目标区域 将 start 移动到中间值后一个
    if (comparator.lessThan(sortedArray[middle], seekElement)) {
      start = middle + 1;
    } else { // 反之
      end = middle - 1;
    }
  }

  // 当 start > end 则说明没找到
  return false
}