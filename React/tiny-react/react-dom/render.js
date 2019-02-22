function render(ele, container) {

  // 没被 html 标签包裹的 字段节点， 没有 children
  if (typeof ele === 'string') {
    const node = document.createTextNode(ele)
    return container.appendChild(node)
  }

  // 有标签的节点
  const node = document.createElement(ele.type)

  // 如果有属性 则赋值属性
  if (ele.attrs) {
    for (let attr in ele.attrs) {
      node.setAttribute(attr, ele.attrs[attr])
    }
  }

  // 遍历子节点（起码有一个 child 是节点内的文字内容
  for (let child of ele.children) {
    render(child, node)
  }

  return container.appendChild(node)
}

export default render