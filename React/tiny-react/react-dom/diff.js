import { buildNode } from './render'

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
 * @returns
 */
function idiff(dom, vnode) {
  let out = dom

  // null boolean
  if (vnode == null || typeof vnode === 'boolean') vnode = ''

  // string number
  if (typeof vnode === 'string') {
    // dom 不为空时
    if (dom && dom.splitText !== undefined && dom.parentNode) {
      if (dom.nodeValue != vnode) { // 如果 dom 与 vnode 不同则更新
        dom.nodeValue = vnode
      }
    } else { // dom 为空时 创建新节点
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

  if (!dom) {
    out = document.createElement(vnodeName)
  }

  if (vnode.children && vnode.children.length) {
    diffChildren(out, vnode.children)
  }


  return out
}

function buildComponentFromVNode(dom, vnode) {

  let c = dom && dom._component
  let oldDom = dom

  // 如果组件类型没有变化，则重新set props
  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode.attrs)
    dom = c.base
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
  } else {

    if (c) {
      unmountComponent(c)
      oldDom = null
    }

    c = createComponent(vnode.tag, vnode.attrs)

    setComponentProps(c, vnode.attrs)
    dom = c.base

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
  if (component.componentWillUnmount) component.componentWillUnmount();
  removeNode(component.base);
}