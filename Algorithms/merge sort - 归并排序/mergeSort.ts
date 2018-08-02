/**
 * 在计算机科学中，合并排序(也通常拼写为 merge sort)是一种高效、通用、基于比较的排序算法。
 * 大多数实现产生了稳定的排序，这意味着实现保留了排序输出中相等元素的输入顺序。
 * merge sort 是约翰·冯·纽曼在1945年发明的一种分而治之的算法。 合并排序的一个例子。
 * 首先将列表分成最小的单元(1个元素)，然后将每个元素与相邻列表进行比较，以对两个相邻列表进行排序和合并。最后，对所有元素进行排序和合并。
 * 
 * 复杂度
 * 
 * Best     Average  Worst   Memory	Stable	Comments
 * nlog(n)  nlog(n)	 nlog(n) n	      Yes
 * 
 */
import Comparator from '../utils/comparator'


function mergeSort(originalArray, comparatorCallback?) {
  const comparator = new Comparator(comparatorCallback)

  
}

// console.log(mergeSort([15, 8, 5, 12, 10, 1, 16, 9, 11, 7, 20, 3, 2, 6, 17, 18, 4, 13, 14, 19]))