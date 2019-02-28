import { Component } from '../react/ReactBaseClasses'
import { setAttribute } from './utils'
import { diff } from './diff'

export function buildNode(vnode) {
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  // 没被 html 标签包裹的 string number节点， 没有 children
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    const node = document.createTextNode(vnode)
    return node
  }

  // 如果是 ReactElement 即 type 为 function
  if (typeof vnode.type === 'function') {
    // ReactElement 实例
    const instance = createComponent(vnode.type, vnode.attrs)
    component._component = instance
    setComponentProps(instance, vnode.attrs)
    return instance.base
  }

  // 有标签的节点
  const node = document.createElement(vnode.type)

  // 如果有属性 则赋值属性
  if (vnode.attrs) {
    for (let attr in vnode.attrs) {
      setAttribute(node, attr, vnode.attrs[attr])
    }
  }

  // 遍历子节点（起码有一个 child 是节点内的文字内容
  for (let child of vnode.children) {
    render(child, node)
  }

  return node
}

function render(vnode, container, dom) {
  return diff(dom, vnode, container)
  // return container.appendChild(buildNode(vnode))
}


/**
 * 构建 React 组件
 *
 * @param {*} Constructor class 组件 / function 组件
 * @param {*} props 组件的 props
 * @returns
 */
export function createComponent(Constructor, props) {
  let instance = null
  // 如果是 class 组件则构建 instance
  if (Constructor.prototype && Constructor.prototype.render) {
    instance = new Constructor(props)
  } else { // 如果是 function 组件则将其构建为 class 组件
    instance = new Component(props)
    instance.constructor = Constructor
    instance.render = function (props) {
      return this.constructor(props)
    }
  }

  return instance
}

/**
 * 给组件设置 props 
 *
 * @param {*} component
 * @param {*} props
 */
export function setComponentProps(component, props) {
  const isUpdate = !!component.base

  // 如果是更新阶段
  if (isUpdate) {
    if (component.componentWillReceiveProps) component.componentWillReceiveProps(props)
  } else if (component.componentWillMount) {
    // 如果是装载阶段
    component.componentWillMount();
  }

  component.props = props
  renderComponent(component)
}


/**
 * 渲染 component 
 *
 * @export
 * @param {*} component
 */
export function renderComponent(component) {
  const renderer = component.render()
  const isUpdate = !!component.base

  if (isUpdate && component.componentWillUpdate) {
    component.componentWillUpdate(props);
  }
  // base 是组件渲染的节点
  // 将已有 dom 与新的 dom 进行比对
  const base = diff(component.base, renderer)

  if (isUpdate) {
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }
  component._dirty = false

  // 如果已有 component.base 则进入更新模式 将老的节点替换为新节点
  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }
  component.base = base
}

export default function (vnode, container) {
  container.innerHTML = ''
  return render(vnode, container)
}