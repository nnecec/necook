import { renderComponent } from "./render";

let setStateQueue = []

export function enqueueRender(component, partialState, callback) {
  if (!component._dirty) {
    component._dirty = true

    // 当 setStateQueue 为空时，异步调用渲染
    if (setStateQueue.push(component) === 1) {
      defer(rerender)
    }
  }
}

export function rerender() {
  let p
  while ((p = setStateQueue.pop())) {
    if (p._dirty) renderComponent(p)
  }
}

const defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
