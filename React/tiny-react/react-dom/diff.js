import { buildNode } from './render'

export function diff(dom, vnode, parent) {


  let ret = idiff(dom, vnode)

  if (parent) parent.appendChild(buildNode(vnode))

  return ret
}

function idiff(dom, vnode) {
  let out = dom
  if (dom) {
    if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
  }

  return out
}