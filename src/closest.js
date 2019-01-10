export default function closest(node, selector) {
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode
  }
  return node.closest(selector)
}
