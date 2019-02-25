import { renderComponent } from '../react-dom/render'
import { enqueueRender } from '../react-dom/render-queue'

export class Component {
  constructor(props) {
    this.props = props
    this.state = this.state || {}
  }

  setState(partialState, callback) {
    // 将新的 state 合并到 this.state 并触发重新渲染
    this.state = Object.assign(this.state, partialState)
    enqueueRender(this)
  }
}