import { buildNode, createComponent, setComponentProps } from './render'
import { setAttribute } from './utils'

export function diff(dom, vnode, parent) {
  let ret = idiff(dom, vnode)

  if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  return ret
}


/**
 * dom 与 vnode diff 
 *
 * @param {*} dom 当前 dom
 * @param {*} vnode 新 dom
 * @returns 返回对比结果 dom
 */
function idiff(dom, vnode) {
  let out = dom

  // null boolean
  if (vnode == null || typeof vnode === 'boolean') vnode = ''

  // string number
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    // dom 不为空时
    if (dom && dom.splitText !== undefined && dom.parentNode) {
      if (dom.nodeValue != vnode) { // 如果值不同则更新
        dom.nodeValue = vnode
      }
    } else { // dom 为空时 创建新文本节点
      out = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }
    return out
  }

  let vnodeName = vnode.type

  // ReactElement
  if (typeof vnodeName === 'function') {
    return buildComponentFromVNode(dom, vnode)
  }

  // 如果没有真实dom 则根据 vnode 创建新dom
  if (!dom) {
    out = document.createElement(vnodeName)
  }

  // 如果还有子节点 diff 子节点
  if (vnode.children && vnode.children.length) {
    diffChildren(out, vnode.children)
  }

  // diff 属性
  diffAttributes(out, vnode.attrs)

  return out
}

function buildComponentFromVNode(dom, vnode) {
  let c = dom && dom._component
  let oldDom = dom

  // 如果组件类型没有变化，则重新设置 props
  if (c && c.constructor === vnode.type) {
    setComponentProps(c, vnode.attrs)
    dom = c.base
    // 如果组件类型变化
  } else {
    if (c) { // 移除掉原来组件
      unmountComponent(c)
      dom = oldDom = null
    }

    // 并渲染新的组件
    c = createComponent(vnode.type, vnode.attrs)

    setComponentProps(c, vnode.attrs)
    dom = c.base

    // 如果新旧 dom 不同 替换旧dom
    if (oldDom && dom !== oldDom) {
      oldDom._component = null
      removeNode(oldDom)
    }

  }

  return dom

}


function diffChildren(dom, vchildren) {

  const domChildren = dom.childNodes
  const children = []

  const keyed = {}

  if (domChildren.length > 0) {
    for (let i = 0; i < domChildren.length; i++) {
      const child = domChildren[i]
      const key = child.key
      if (key) {
        keyedLen++
        keyed[key] = child
      } else {
        children.push(child)
      }
    }
  }

  if (vchildren && vchildren.length > 0) {

    let min = 0;
    let childrenLen = children.length

    for (let i = 0; i < vchildren.length; i++) {

      const vchild = vchildren[i]
      const key = vchild.key
      let child

      if (key) {

        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }

      } else if (min < childrenLen) {

        for (let j = min; j < childrenLen; j++) {

          let c = children[j]

          if (c && isSameNodeType(c, vchild)) {

            child = c
            children[j] = undefined

            if (j === childrenLen - 1) childrenLen--
            if (j === min) min++
            break

          }

        }

      }

      child = idiff(child, vchild)

      const f = domChildren[i]
      if (child && child !== dom && child !== f) {
        if (!f) {
          dom.appendChild(child)
        } else if (child === f.nextSibling) {
          removeNode(f)
        } else {
          dom.insertBefore(child, f)
        }
      }

    }
  }

}

function unmountComponent(component) {
  if (component.componentWillUnmount) component.componentWillUnmount()
  removeNode(component.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom)
  }

}

function diffAttributes(dom, attrs) {
  const old = {}

  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i]
    old[attr.name] = attr.value
  }

  // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
  for (let name in old) {
    if (!(name in attrs)) {
      setAttribute(dom, name, undefined)
    }
  }

  // 更新新的属性值
  for (let name in attrs) {
    if (old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name])
    }
  }
}

function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3
  }

  if (typeof vnode.type === 'string') {
    return dom.nodeName.toLowerCase() === vnode.type.toLowerCase();
  }

  return dom && dom._component && dom._component.constructor === vnode.type;
}