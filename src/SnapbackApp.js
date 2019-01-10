import Snapback from "snapback"
// import pretty from 'pretty'
import prettier from "prettier/standalone"
import prettierHTML from "prettier/parser-html"
import React, { Component } from "react"
import "./SnapbackApp.css"

const __html = `<div data-key="1969" style="position: relative;"><span data-key="1970"><span data-slate-leaf="true" data-offset-key="1970:0"><span data-slate-content="true">This is editable </span></span><span data-slate-leaf="true" data-offset-key="1970:1"><strong data-slate-mark="true"><span data-slate-content="true">rich</span></strong></span><span data-slate-leaf="true" data-offset-key="1970:2"><span data-slate-content="true"> text, </span></span><span data-slate-leaf="true" data-offset-key="1970:3"><em data-slate-mark="true"><span data-slate-content="true">much</span></em></span><span data-slate-leaf="true" data-offset-key="1970:4"><span data-slate-content="true"> better than a </span></span><span data-slate-leaf="true" data-offset-key="1970:5"><code data-slate-mark="true"><span data-slate-content="true">&lt;textarea&gt;</span></code></span><span data-slate-leaf="true" data-offset-key="1970:6"><span data-slate-content="true">!</span></span></span></div>`

class App extends Component {
  state = { html: "" }

  componentDidMount() {
    const el = document.getElementById("editor")
    const html = el.innerHTML
    this.setState({ html })
  }

  scaffold = () => {
    this.setState({ html: __html })
  }

  snapshot = () => {
    const el = document.getElementById("editor")
    const snapback = (this.snapback = new Snapback(el))
    snapback.enable()
  }

  update = () => {
    const el = document.getElementById("editor")
    const html = el.innerHTML
    this.setState({ html })
  }

  undo = () => {
    this.snapback.undo()
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
      <div className="App">
        <button onClick={this.scaffold}>Scaffold</button>
        <button onClick={this.snapshot}>Snapshot</button>
        <button onClick={this.undo}>Undo</button>
        <button onClick={this.update}>Update Code</button>
        <div
          id="editor"
          contentEditable
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div id="html">{code}</div>
      </div>
    )
  }
}

export default App
