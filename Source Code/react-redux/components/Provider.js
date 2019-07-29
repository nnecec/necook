import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReactReduxContext } from "./Context";
import Subscription from "../utils/Subscription";

class Provider extends Component {
  constructor(props) {
    super(props);

    const { store } = props; // 传入的 store

    this.notifySubscribers = this.notifySubscribers.bind(this);
    const subscription = new Subscription(store);
    subscription.onStateChange = this.notifySubscribers; // 状态改变的勾子函数

    this.state = {
      store,
      subscription
    };

    this.previousState = store.getState(); // 获取 store
  }

  componentDidMount() {
    this.state.subscription.trySubscribe();

    if (this.previousState !== this.props.store.getState()) {
      this.state.subscription.notifyNestedSubs();
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();

    this.state.subscription.tryUnsubscribe();
  }

  componentDidUpdate(prevProps) {
    if (this.props.store !== prevProps.store) { // redux 有改动时
      this.state.subscription.tryUnsubscribe();
      const subscription = new Subscription(this.props.store);
      subscription.onStateChange = this.notifySubscribers;
      this.setState({ store: this.props.store, subscription }); // 更新 store
    }
  }

  notifySubscribers() {
    this.state.subscription.notifyNestedSubs();
  }

  render() {
    const Context = this.props.context || ReactReduxContext; // 使用 context

    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

Provider.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
  }),
  context: PropTypes.object,
  children: PropTypes.any
};

export default Provider;
