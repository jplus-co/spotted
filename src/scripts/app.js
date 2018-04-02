import $ from 'jquery'
import config from './config'
import Header from './modules/header'
import Button from './modules/button'

class App {
  constructor() {
    this.el = config.app
    this.header = new Header($('.js-header'))
    this.$nav = $('.js-nav')
  }

  onResize(width, height) {
    this.header.resize(width, height)
  }

  onNewPageReady(currentStatus, prevStatus, container, html) {
    this.buttons = $(container)
      .find('.js-button')
      .toArray()
      .map(el => new Button($(el)))
  }
}

export default () => new App()
