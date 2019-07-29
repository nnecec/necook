import { wrapMapToPropsConstant, wrapMapToPropsFunc } from "./wrapMapToProps";

// 可以是 function
export function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === "function"
    ? wrapMapToPropsFunc(mapStateToProps, "mapStateToProps")
    : undefined;
}

// 可以为空
export function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(() => ({})) : undefined;
}

export default [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];


/** 
 * 
 * match(
      mapStateToProps,
      mapStateToPropsFactories,
      "mapStateToProps"
  );
  如果传入了 mapStateToProps， 则进入 whenMapStateToPropsIsFunction true 的判断逻辑，并调用 wrapMapToPropsFunc
*/