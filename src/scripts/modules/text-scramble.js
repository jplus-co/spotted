import $ from 'jquery'

class TextScramble {
  constructor($el, opt = {}) {
    this.$el = $el
    this.text = this.$el.text()
    this.chars = this.text.split('')
    this.duration = opt.duration || 50
    this.speed = opt.speed || 3
    this.raf = 0
    this.frame = 0
  }

  scramble = () => {
    const promise = new Promise(resolve => (this.resolve = resolve))
    this.reset()
    this.raf = requestAnimationFrame(this.update)
    return promise
  }

  update = () => {
    if (this.frame <= this.duration) {
      this.frame++
      if (this.frame % this.speed === 0) {
        this.$el.html(
          this.chars
            .map(
              char =>
                `<span>${
                  Math.random() > 0.75 ? this.randomChar() : char
                }</span>`,
            )
            .join(''),
        )
      }
      this.raf = requestAnimationFrame(this.update)
    } else {
      this.reset()
      return this.resolve()
    }
  }

  reset = () => {
    cancelAnimationFrame(this.raf)
    this.frame = 0
    this.$el.html(this.text)
  }

  randomChar() {
    const chars = '!<>-_\\/[]{}—=+*^?#________'
    return chars[Math.floor(Math.random() * chars.length)]
  }
}

export default TextScramble
