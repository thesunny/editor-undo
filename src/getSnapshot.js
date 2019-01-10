function __getSnapshot__(node) {
  const snapshot = {}
  snapshot.node = node
  snapshot.children = Array.from(node.childNodes).map(__getSnapshot__)
  return snapshot
}

export default function getSnapshot(node) {
  const snapshot = __getSnapshot__(node)
  return snapshot
}
