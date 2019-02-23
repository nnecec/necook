import React, { Component } from '../../react/React'

export default class State extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  componentDidUpdate() {
    console.log('state did update.')
  }

  componentDidMount() {
    console.log('state did mount.')
  }

  changeCount = () => {
    const { count } = this.state
    console.log(count)

    this.setState({
      count: count + 1
    })
  }

  render() {
    const { count } = this.state
    return (
      <div id="state">
        <p>count:{count}</p>
        <button onClick={this.changeCount}>change count</button>
      </div>
    )
  }
}