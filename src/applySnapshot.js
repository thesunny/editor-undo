function __applySnapshot__(snapshot, el) {
  snapshot.children.forEach(childSnapshot => {
    __applySnapshot__(childSnapshot, childSnapshot.node)
    el.appendChild(childSnapshot.node)
  })
  const snapLength = snapshot.children.length
  while (el.childNodes.length > snapLength) {
    el.removeChild(el.childNodes[0])
  }
}

export default function applySnapshot(snapshot, el) {
  __applySnapshot__(snapshot, el)
}
