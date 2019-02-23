import React, { Component } from '../../react/React'

export default class State extends Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate() {
    console.log('state did update.')
  }

  componentDidMount() {
    console.log('state did mount.')
    console.log(document.getElementById('state'))
  }

  render() {
    return (<div id="state">hello world!</div>)
  }
}