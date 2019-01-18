import React from "react"
import "bootstrap/dist/css/bootstrap.css"

import prettier from "prettier/standalone"
import prettierHTML from "prettier/parser-html"

import initialHTML from "./simple-html"
import ActionSnapshot from "./ActionSnapshot"

let actionSnapshot = null

export default class StitchApp extends React.Component {
  editorRef = React.createRef()
  state = { html: initialHTML }

  update = () => {
    const el = this.editorRef.current
    const html = el.innerHTML
    this.setState({ html })
  }

  onKeyDown = () => {
    actionSnapshot = new ActionSnapshot(window)
  }

  onInput = () => {
    requestAnimationFrame(() => {
      const action = actionSnapshot.compare(window)
      console.log("action", action)
    })
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
            onKeyDown={this.onKeyDown}
            onInput={this.onInput}
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
