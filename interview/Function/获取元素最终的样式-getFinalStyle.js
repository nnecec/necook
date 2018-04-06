// String对象的 replace(regex,function(){}) 方法中，参数列表的意义是这样的：
// 第一个参数在regex这个完整的正则匹配出来的结果
// 倒数第二个参数是第一个参数（匹配结果）在输入字符串中的索引位置
// 最后一个参数是输入字符串本身
// 如果regex中存在分组，那么参 数列表的长度N>3一定成立，且第2到N-2个参数，分别为regex中分组所产生的匹配结果
/**
 * 字符串转换为驼峰写法
 */
function camelize(str) {
  return str.replace(/-(\w)/g, function (strMatch, p1) {
    return p1.toUpperCase();
  });
}

/**
 * 获取元素的最终样式
 */
function getFinalStyle(ele, property) {
  if (!ele || !property) {
    return false;
  }

  const value = ele.style[camelize(property)];
  // 无内联样式，则获取层叠样式表计算后的样式
  if (!value) {
    if (document.defaultView.getComputedStyle) { // 在浏览器中，该属性返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。
      css = document.defaultView.getComputedStyle(ele); // ("元素", "伪类")
      value = css ? css.getPropertyValue(property) : null;
    }
  }

  return value;

}