import { Component } from '../react/ReactBaseClasses'
import { setAttribute } from './utils'

function buildNode(ele) {
  if (ele === undefined || ele === null || typeof ele === 'boolean') ele = '';
  // 没被 html 标签包裹的 string number节点， 没有 children
  if (typeof ele === 'string' || typeof ele === 'number') {
    const node = document.createTextNode(ele)
    return node
  }

  // 如果是 ReactElement 即 type 为 function
  if (typeof ele.type === 'function') {
    // ReactElement 实例
    const instance = createComponent(ele.type, ele.attrs)
    setComponentProps(instance, ele.attrs)
    return instance.base
  }

  // 有标签的节点
  const node = document.createElement(ele.type)

  // 如果有属性 则赋值属性
  if (ele.attrs) {
    for (let attr in ele.attrs) {
      setAttribute(node, attr, ele.attrs[attr])
    }
  }

  // 遍历子节点（起码有一个 child 是节点内的文字内容
  for (let child of ele.children) {
    render(child, node)
  }

  return node
}

function render(ele, container) {
  return container.appendChild(buildNode(ele))
}


/**
 * 构建 React 组件
 *
 * @param {*} Constructor class 组件 / function 组件
 * @param {*} props 组件的 props
 * @returns
 */
function createComponent(Constructor, props) {
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
function setComponentProps(component, props) {
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

  const base = buildNode(renderer) // base 是组件渲染的节点

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

export default function (ele, container) {
  container.innerHTML = ''
  return render(ele, container)
}