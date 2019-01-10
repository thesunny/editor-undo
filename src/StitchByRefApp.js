import React from "react"
import "bootstrap/dist/css/bootstrap.css"

import prettier from "prettier/standalone"
import prettierHTML from "prettier/parser-html"

// import initialHTML from "./initial-html"
import initialHTML from "./initial-html"
// import stitch, { stitchFromNode } from "./stitch"
// import getSnapshot from "./getSnapshot"
// import applySnapshot from "./applySnapshot"
import mergeSplitText from "./merge-split-text"
import ElementSnapshot from "./ElementSnapshot"

export default class StitchApp extends React.Component {
  editorRef = React.createRef()
  state = { html: initialHTML }
  snapshot = null

  update = () => {
    const el = this.editorRef.current
    const html = el.innerHTML
    this.setState({ html })
  }

  stitch = () => {
    const { anchorNode } = window.getSelection()
    const { offsetKey, offset } = mergeSplitText(anchorNode)
    console.log({ offsetKey, offset })
    this.snapshot.revert()
    this.update()
  }

  componentDidMount() {
    const el = document.querySelector(`[data-key='1969']`)
    this.snapshot = new ElementSnapshot(el)
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
