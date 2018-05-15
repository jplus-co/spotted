import Component from '../framework/component'
import Barba from 'barba.js'
import $ from 'jquery'

class Form extends Component {
  constructor(opt = {}) {
    super()

    this.$el = $(opt.el)
    this.$closeButton = $(opt.closeButton)
    this.name = opt.name

    this.state = {
      shown: false,
    }

    this.init()
  }

  init() {
    Barba.Dispatcher.on('contact', () => this.setState({
      shown: !this.state.shown,
    }))

    this.$closeButton.on('click', () => this.setState({
      shown: false,
    }))

    this.$el.on('click', (ev) => {
      if (!this.state.shown) return

      const $target = $(ev.target)
      if ($target.closest(`.${this.name}-form__outer-wrapper`).length) {
        ev.stopPropagation()
        return
      }

      this.setState({
        shown: false,
      })
    })
  }

  didUpdate(oldState) {
    if (oldState.shown !== this.state.shown) {
      this.$el.toggleClass('shown')

      if (this.state.shown) {
        const firstInput = this.$el.find('input:not([type="hidden"])').first()[0]
        firstInput.focus()
      }
    }
  }
}

export default Form
