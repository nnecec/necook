export function setAttribute(node, attr, value) {
  if (/on\w+/.test(attr)) {
    node[attr.toLowerCase()] = value

  } else {
    node.setAttribute(attr, value)
  }
}