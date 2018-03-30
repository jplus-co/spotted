import $ from 'jquery'
import config from './config'
import Header from './modules/header'

class App {
  constructor() {
    this.el = config.app
    this.header = new Header($('.js-header'))
    this.$nav = $('.js-nav')
  }

  onResize(width, height) {
    this.header.resize(width, height)
  }
}

export default () => new App()
