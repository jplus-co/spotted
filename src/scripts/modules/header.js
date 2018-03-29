import $ from 'jquery'
import Button from './button'
import Dropdown from './Dropdown'

class Header {
  constructor(el) {
    this.$el = el
    this.button = new Button(el.find('.js-button'))
    this.dropdowns = el
      .find('.js-dropdown')
      .toArray()
      .map(el => new Dropdown(el))
  }

  resize(w, h) {
    this.dropdowns.forEach(dropdown => dropdown.resize(w, h))
  }
}

export default Header
