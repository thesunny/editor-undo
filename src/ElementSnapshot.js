import getSnapshot from "./getSnapshot"
import applySnapshot from "./applySnapshot"

export default class ElementSnapshot {
  constructor(el) {
    this.snapshot = getSnapshot(el)
  }

  revert() {
    applySnapshot(this.snapshot)
  }
}
