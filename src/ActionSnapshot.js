import invariant from "tiny-invariant"
import closest from "./closest"

// function o(dom) {
//   return Object.assign({}, dom)
// }

// Infer the action a user took based on the state of the DOM.

function getSnapshot(node) {
  const el = closest(node, `[data-slate-leaf]`)
  const subrootEl = closest(el, `[data-slate-editor] > *`)
  return {
    el: el,
    textContent: el.textContent,
    childNodesLength: el.childNodes.length,
    subrootEl,
  }
}

function compare(document, snapshot) {
  const { el, subrootEl } = snapshot

  // Enter based on there being more child nodes (e.g. indicates a <br />)
  // element was inserted into the `data-slate-leaf`.
  if (el.childNodes.length > snapshot.childNodesLength) {
    return { type: "enter", subtype: "br" }
  } else if (el.childNodes.length < snapshot.childNodesLength) {
    // Backspace based on there being less child nodes
    return { type: "backspace", subtype: "element" }
  }

  // Enter based on there being a duplicate `offsetKey`
  // const { offsetKey } = el.dataset
  const duplicateElements = document.querySelectorAll(
    `[data-key="${subrootEl.dataset.key}"]`
  )
  if (duplicateElements.length > 1)
    return { type: "enter", subtype: "split-block" }

  // Insert or Backspace based on change in textContent length
  const sLength = snapshot.textContent.length
  const elLength = el.textContent.length
  if (elLength > sLength) {
    return { type: "insert", subtype: "character" }
  } else if (elLength < sLength) {
    return { type: "backspace", subtype: "character" }
  }

  // If the element cannot be found in the body, this indicates that the
  // current element needs to have a specially handled Backspace.
  // Either (a) merged a block or (b) completely removed a span with a
  // single character.
  if (closest(el, "body") == null) {
    return { type: "backspace", subtype: "special" }
  }
}

export default class ActionSnapshot {
  constructor(window) {
    invariant(window, "window is required")
    const { anchorNode } = window.getSelection()
    this.snapshot = getSnapshot(anchorNode)
  }

  compare(window) {
    invariant(window, "window is required")
    return compare(window.document, this.snapshot)
  }
}
