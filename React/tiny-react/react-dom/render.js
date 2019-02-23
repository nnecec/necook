import { Component } from '../react/ReactBaseClasses'

function appendChildToContainer(ele, container) {
  console.log(ele)

  // 没被 html 标签包裹的 string number节点， 没有 children
  if (typeof ele === 'string' || typeof ele === 'number') {
    const node = document.createTextNode(ele)
    return container.appendChild(node)
  }

  // 如果是 ReactElement 即 type 为 function
  if (typeof ele.type === 'function') {
    let instance = null
    // 如果是 class 组件则构建 instance
    if (ele.type.prototype && ele.type.prototype.render) {
      instance = new ele.type(ele.attrs)

      // 实例接收 props 并调用 render 方法
      instance.props = ele.attrs
      const _renderer = instance.render()
      return appendChildToContainer(_renderer, container)
    }

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
    appendChildToContainer(child, node)
  }

  return container.appendChild(node)
}

function render(ele, container) {
  container.innerHTML = ''
  return appendChildToContainer(ele, container)
}

export default render