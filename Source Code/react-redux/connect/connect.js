import connectAdvanced from "../components/connectAdvanced";
import shallowEqual from "../utils/shallowEqual";
import defaultMapDispatchToPropsFactories from "./mapDispatchToProps";
import defaultMapStateToPropsFactories from "./mapStateToProps";
import defaultMergePropsFactories from "./mergeProps";
import defaultSelectorFactory from "./selectorFactory";

/*
  connect是connectAdvanced。 它将它的参数变成兼容的 selectorFactory，具有签名：

     （dispatch，options）=>（nextState，nextOwnProps）=> nextFinalProps
  
   connect将参数传递给 connectAdvanced 作为 options，然后每次实例化或在 hot reload Connect组件实例时，将它们传递给 selectorFactory 

   selectorFactory 从其 mapStateToProps 返回一个 final props 选择器，
   mapStateToPropsFactories，mapDispatchToProps，mapDispatchToPropsFactories，mergeProps，
   mergePropsFactories和纯粹的args。

   生成的最终 props selector 每次都由 Connect 组件实例调用
   它接收新的 props 或 store state。
 */

 // 判断 arg 是否是属于 factories 类型，如果符合则返回匹配后的 result
function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg);
    if (result) return result;
  }

  return (dispatch, options) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
        options.wrappedComponentName
      }.`
    );
  };
}

function strictEqual(a, b) {
  return a === b;
}

// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
export function createConnect({
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory
} = {}) {
  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      pure = true,
      areStatesEqual = strictEqual,
      areOwnPropsEqual = shallowEqual,
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions
    } = {}
  ) {
    const initMapStateToProps = match(
      mapStateToProps,
      mapStateToPropsFactories,
      "mapStateToProps"
    );
    const initMapDispatchToProps = match(
      mapDispatchToProps,
      mapDispatchToPropsFactories,
      "mapDispatchToProps"
    );
    const initMergeProps = match(mergeProps, mergePropsFactories, "mergeProps");

    return connectHOC(selectorFactory, {
      // used in error messages
      methodName: "connect",

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: name => `Connect(${name})`,

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,

      // any extra options args can override defaults of connect or connectAdvanced
      ...extraOptions
    });
  };
}

export default createConnect();
