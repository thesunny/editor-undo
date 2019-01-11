function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE
}

function __getSnapshot(node) {
  const snapshot = {}
  snapshot.node = node
  if (isTextNode(node)) {
    snapshot.text = node.textContent
  }
  snapshot.children = Array.from(node.childNodes).map(__getSnapshot)
  return snapshot
}

function getSnapshot(node) {
  const snapshot = __getSnapshot(node)
  snapshot.parent = node.parentElement
  snapshot.next = node.nextElementSibling
  return snapshot
}

function __applySnapshot(snapshot) {
  const el = snapshot.node
  if (isTextNode(el)) {
    // Don't do unnecessary DOM update
    if (el.textContent !== snapshot.text) {
      el.textContent = snapshot.text
    }
  }
  snapshot.children.forEach(childSnapshot => {
    __applySnapshot(childSnapshot, childSnapshot.node)
    el.appendChild(childSnapshot.node)
  })

  // remove children that shouldn't be there
  const snapLength = snapshot.children.length
  while (el.childNodes.length > snapLength) {
    el.removeChild(el.childNodes[0])
  }

  // remove any clones of this
  const { dataset } = el
  if (!dataset) return // if there's no dataset, don't remove it
  const key = dataset.key
  if (!key) return // if there's no `data-key`, don't remove it
  const dups = new Set(
    Array.from(document.querySelectorAll(`[data-key='${key}']`))
  )
  dups.delete(el)
  dups.forEach(dup => dup.parentElement.removeChild(dup))
}

function applySnapshot(snapshot) {
  __applySnapshot(snapshot)
  const { node, next, parent } = snapshot
  if (snapshot.next) {
    parent.insertBefore(node, next)
  } else {
    parent.appendChild(node)
  }
}

export default class ElementSnapshot {
  constructor(el) {
    this.snapshot = getSnapshot(el)
  }

  apply() {
    applySnapshot(this.snapshot)
  }
}
