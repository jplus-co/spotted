import randomInt from '../util/randomInt'

class Glitch {
  constructor(el, options) {
    this.DOM = {}
    this.DOM.el = el
    this.options = {
      // Max and Min values for the time when to start the effect.
      glitchStart: { min: 500, max: 10000 },
      // Max and Min values of time that an element keeps each state.
      glitchState: { min: 50, max: 100 },
      // Number of times the glitch action is performed per iteration.
      glitchTotalIterations: 5,
      glitchStateProperty: 'transform',
      glitchStateValue: () =>
        `translate3d(${randomInt(-5, 5)}px,${randomInt(
          -5,
          5,
        )}px,0px) rotate3d(0,0,1,${randomInt(-2, 2)}deg)`,
      glitchStateValueReset: 'translate3d(0,0,0) rotate3d(1,1,1,0)',
    }
    Object.assign(this.options, options)
  }

  glitch() {
    this.isInactive = false
    clearTimeout(this.glitchTimeout)
    this.glitchTimeout = setTimeout(() => {
      this.iteration = 0
      this.glitchState().then(() => {
        if (!this.isInactive) {
          this.glitch()
        }
      })
    }, randomInt(this.options.glitchStart.min, this.options.glitchStart.max))
  }

  glitchState() {
    return new Promise((resolve, reject) => {
      if (this.iteration < this.options.glitchTotalIterations) {
        this.glitchStateTimeout = setTimeout(() => {
          this.DOM.el.style[
            this.options.glitchStateProperty
          ] = this.options.glitchStateValue()
          this.iteration++
          if (!this.isInactive) {
            this.glitchState().then(() => resolve())
          }
        }, randomInt(this.options.glitchState.min, this.options.glitchState.max))
      } else {
        this.reset()
        resolve()
      }
    })
  }

  stop() {
    this.isInactive = true
    clearTimeout(this.glitchTimeout)
    clearTimeout(this.glitchStateTimeout)
    this.reset()
    return this
  }

  reset() {
    this.DOM.el.style[
      this.options.glitchStateProperty
    ] = this.options.glitchStateValueReset
  }
}

export default Glitch
