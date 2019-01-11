import React from "react"
import "bootstrap/dist/css/bootstrap.css"

import prettier from "prettier/standalone"
import prettierHTML from "prettier/parser-html"

import initialHTML from "./empty-paragraph-html"
import closest from "./closest"
import getSplitPos from "./get-split-pos"
import ElementSnapshot from "./ElementSnapshot"

export default class StitchApp extends React.Component {
  editorRef = React.createRef()
  state = { html: initialHTML }
  __snapshot__ = null

  update = () => {
    const el = this.editorRef.current
    const html = el.innerHTML
    this.setState({ html })
  }

  snapshot = () => {
    const editorDiv = this.editorRef.current
    editorDiv.focus()
    const { anchorNode } = window.getSelection()
    const subrootEl = closest(anchorNode, `[data-slate-editor] > *`)
    const elements = [subrootEl]
    const { previousElementSibling } = subrootEl
    if (previousElementSibling) {
      elements.unshift(previousElementSibling)
    }
    this.__snapshot__ = new ElementSnapshot(elements)
    console.log(this.__snapshot__)
  }

  stitch = () => {
    const { anchorNode } = window.getSelection()
    const { offsetKey, offset } = getSplitPos(anchorNode)
    console.log({ offsetKey, offset })
    this.__snapshot__.apply()
    this.update()
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
          <button className="btn btn-sm btn-primary" onClick={this.snapshot}>
            Snapshot
          </button>
          <button className="btn btn-sm btn-primary" onClick={this.stitch}>
            Stitch
          </button>
        </div>
        <div className="form-group">
          <label>Editor</label>
          <div
            data-slate-editor
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
