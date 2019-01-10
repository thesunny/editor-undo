import React from "react"
import "bootstrap/dist/css/bootstrap.css"

import prettier from "prettier/standalone"
import prettierHTML from "prettier/parser-html"

// import initialHTML from "./initial-html"
import initialHTML from "./initial-html"
// import stitch, { stitchFromNode } from "./stitch"
import getSnapshot from "./getSnapshot"
import applySnapshot from "./applySnapshot"

function getLeaf(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode
  }
  return node.closest("[data-slate-leaf]")
}

// returns {offsetKey, offset}
function mergeSlateLeaf(node) {
  const slateLeaf = getLeaf(node)
  const offsetKey = slateLeaf.dataset.offsetKey
  const textNodes = document.querySelectorAll(
    `[data-offset-key='${offsetKey}']`
  )

  // On Desktop Chrome: This happens if you split at the end of a block
  if (node.nodeType !== Node.TEXT_NODE) {
    return { offsetKey, offset: textNodes[0].textContent.length }
  }

  // On Desktop Chrome:
  // This happens if you split at the beginning or end of a node.
  // Does not happen at beginning of block.
  if (textNodes.length === 1) {
    return { offsetKey, offset: 0 }
  }

  const offset = textNodes[0].textContent.length
  node.textContent = Array.from(textNodes)
    .map(textNode => textNode.textContent)
    .join("")
  return { offsetKey, offset }
}

export default class StitchApp extends React.Component {
  editorRef = React.createRef()
  state = { html: initialHTML }

  update = () => {
    const el = this.editorRef.current
    const html = el.innerHTML
    this.setState({ html })
  }

  stitch = () => {
    const { anchorNode } = window.getSelection()
    const mergeData = mergeSlateLeaf(anchorNode)
    applySnapshot(this.snapshot, this.editorRef.current)
  }

  componentDidMount() {
    this.snapshot = getSnapshot(this.editorRef.current)
  }

  render() {
    const { html } = this.state
    const code = prettier.format(html, {
      parser: "html",
      htmlWhitespaceSensitivity: "ignore",
      plugins: [prettierHTML],
    })
    return (
      <div className="container">
        <div className="mb-3" style={{ WebkitUserSelect: "none" }}>
          <button className="btn btn-sm btn-primary" onClick={this.update}>
            Update
          </button>
          <button className="btn btn-sm btn-primary" onClick={this.stitch}>
            Stitch
          </button>
        </div>
        <div className="form-group">
          <label>Editor</label>
          <div
            ref={this.editorRef}
            className="border p-3 rounded"
            contentEditable
            dangerouslySetInnerHTML={{ __html: initialHTML }}
            data-key="1968"
          />
        </div>
        <div className="form-group">
          <label>HTML</label>
          <pre className="border p-3">{code}</pre>
        </div>
      </div>
    )
  }
}
