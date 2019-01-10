import React from "react"
import "bootstrap/dist/css/bootstrap.css"

import prettier from "prettier/standalone"
import prettierHTML from "prettier/parser-html"

// import initialHTML from "./initial-html"
import initialHTML from "./split-html"
import stitch, { stitchFromNode } from "./stitch"

export default class StitchApp extends React.Component {
  editorRef = React.createRef()
  state = { html: initialHTML }

  update = () => {
    const el = this.editorRef.current
    const html = el.innerHTML
    this.setState({ html })
  }

  getElement = () => {
    const selection = window.getSelection()
    let { anchorNode } = selection
    const result = stitchFromNode(anchorNode)
    console.log(result)
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
        </div>
        <div className="form-group">
          <label>Editor</label>
          <div
            ref={this.editorRef}
            className="border p-3 rounded"
            contentEditable
            dangerouslySetInnerHTML={{ __html: initialHTML }}
            onClick={() => setTimeout(this.getElement, 100)}
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
