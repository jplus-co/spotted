import Component from '../framework/component'
import Barba from 'barba.js'
import $ from 'jquery'

class ContactForm extends Component {
  constructor(opt = {}) {
    super()

    this.$el = $(opt.el)
    this.$closeButton = $(opt.closeButton)

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
      const $target = $(ev.target)
      if ($target.closest('.contact-form__outer-wrapper').length) {
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
        firstInput.tabIndex = -1
        firstInput.focus()
      }
    }
  }
}

export default ContactForm
