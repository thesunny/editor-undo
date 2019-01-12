// Creates an executor like a `resolveExecutor` or a `deleteExecutor` that
// handles execution of a method. Unlike a `requestAnimationFrame`, after
// a method is cancelled, it can also be resumed.

function noop() {}

class Executor {
  constructor(fn, window, timeout) {
    this.fn = fn
    this.window = window
    this.resume()
    this.setTimeout(timeout)
  }

  call = () => {
    // I don't clear the timeout since it will be noop'ed anyways. Less code.
    this.fn()
    this.fn = noop // Ensure you can only call the function once
  }

  resume = () => {
    this.cancel() // in case resume is called more than once
    this.callbackId = this.window.requestAnimationFrame(this.call)
  }

  cancel = () => {
    if (this.callbackId) {
      this.window.cancelAnimationFrame(this.callbackId)
    }
  }

  setTimeout = timeout => {
    this.clearTimeout() // in case one was set before
    this.timeoutId = this.window.setTimeout(this.call, timeout)
  }

  clearTimeout = () => {
    if (this.timeoutId) {
      this.window.clearTimeout(this.timeoutId)
    }
  }
}
