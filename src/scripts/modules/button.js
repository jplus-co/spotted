import $ from 'jquery'
import TextScramble from './text-scramble'

class Button {
  constructor(el) {
    this.$el = el
    this.text = new TextScramble(el.find('span'))
    this.init()
  }

  init() {
    this.$el.on('mouseenter', this.text.scramble)
  }

  destroy() {
    this.$el.off('mouseenter', this.text.scramble)
  }
}

export default Button
