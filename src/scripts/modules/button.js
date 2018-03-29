import $ from 'jquery'

class Button {
  constructor(el) {
    this.$el = el
    this.$span = el.find('span')

    this.text = this.$span.text()
    this.chars = this.text.split('')
    this.raf = 0
    this.frame = 0
    this.duration = 50
    this.speed = 3

    this.init()
  }

  init() {
    this.$el.on('mouseenter', this.scramble)
  }

  destroy() {
    this.$el.off('mouseenter', this.scramble)
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
        this.$span.html(
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
    this.$span.html(this.text)
  }

  randomChar() {
    const chars = '!<>-_\\/[]{}—=+*^?#________'
    return chars[Math.floor(Math.random() * chars.length)]
  }
}

export default Button
