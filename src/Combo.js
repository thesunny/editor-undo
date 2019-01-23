function checkStep(step, value) {
  if (step.pass(value) === true) {
    return true
  } else if (step.fail(value) === true) {
    return false
  } else {
    return null
  }
}

// A Combo resolves if it gets through all of its steps.
// It doesn't reject at any point.
// It only executes when it's requestAnimationFrame is done.
// If there is no `pass` method on the last step then it can execute as well.
class Combo {
  constructor(window, steps, resolve, reject) {
    invariant(typeOf(steps) === "array")
    invariant(typeOf(resolve) === "function")
    invariant(typeOf(reject) === "function")
    this.stepIndex = 0
    this.steps = steps
    this.resolve = resolve
    this.reject = reject
    this.cancelled = false
    window.requestAnimationFrame(() => {
      this.finish()
    })
  }

  get currentStep() {
    return this.steps[this.stepIndex]
  }

  trigger(value) {
    const step = this.currentStep
    if (step == null) return // not step then nothing to trigger
    if (step.fail && step.fail(value)) {
      this.cancel()
      return
    } else if (step.pass && step.pass(value)) {
      this.stepIndex++
    }
  }

  cancel() {
    this.cancelled = true
  }

  resume() {
    this.cancelled = false
  }

  finish() {
    if (this.cancelled) return
    const { currentStep } = this
    if (currentStep && currentStep.pass != null) return
    this.resolve()
  }

}
