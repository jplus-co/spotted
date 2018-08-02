import Component from '../framework/component'
import Barba from 'barba.js'
import $ from 'jquery'

class Form extends Component {
  constructor(name) {
    super()

    this.name = name
    this.$el = $(`.js-${this.name}-form`)
    this.$closeButton = $(`.js-${this.name}-form-close-button`)

    this.state = {
      shown: false,
    }

    this.init()
  }

  init() {
    Barba.Dispatcher.on(this.name, () =>
      this.setState({
        shown: !this.state.shown,
      }),
    )

    this.$closeButton.on('click', () =>
      this.setState({
        shown: false,
      }),
    )

    this.$el.on('click', ev => {
      if (!this.state.shown) return

      const $target = $(ev.target)
      if ($target.closest(`.js-${this.name}-form-outer-wrapper`).length) {
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
        const firstInput = this.$el
          .find('input:not([type="hidden"])')
          .first()[0]
        firstInput.focus()
      }
    }
  }
}

export default Form
