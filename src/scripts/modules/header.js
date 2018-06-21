import $ from 'jquery'
import config from '../config'
import Button from './button'
import Dropdown from './dropdown'
import MobileNav from './mobile-nav'

class Header {
  constructor(el) {
    this.$el = el
    this.button = new Button(el.find('.js-button'))
    this.dropdowns = el
      .find('.js-dropdown')
      .toArray()
      .map(el => new Dropdown(el))
    this.mobileNav = new MobileNav({
      toggle: el.find('.js-nav-toggle'),
      menu: el.find('.js-nav-menu'),
    })
  }

  resize(w, h) {
    this.dropdowns.forEach(dropdown => dropdown.resize(w, h))
  }
}

export default Header
