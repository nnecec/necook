/**
 * 获取node种类各有多少数量
 */
function nodeCount() {
  const allNodes = document.querySelectorAll('*');
  let counts = {};
  for (let i = 0, length = allNodes.length; i < length; i++) {
    const typeName = allNodes[i].nodeName;
    counts[typeName] = counts[typeName] ? counts[typeName] + 1 : 1;
  }
  return counts;
}


/**
 * 一共用了多少种html标签
 */
function nodeTypeCount() {
  const allNodes = document.getElementsByTagName('*');
  let typeCounts = 0;
  let typeArr = [];
  for (let i = 0, length = allNodes.length; i < length; i++) {
    const typeName = allNodes[i].nodeName;
    if (typeArr.indexOf(typeName) === -1) {
      typeArr.push(typeName);
      typeCounts += 1;
    }
  };
  return typeCounts;
}
