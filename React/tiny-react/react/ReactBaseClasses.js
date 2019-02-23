import { renderReactComponent } from '../react-dom/render'

export class Component {
  constructor(props) {
    this.props = props
    this.state = {}
  }

  setState(newState, callback) {
    // 将新的 state 合并到 this.state 并触发重新渲染
    this.state = Object.assign(this.state, newState)
    renderReactComponent(this)
  }
}
