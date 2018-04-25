import $ from 'jquery'
import config from './config'
import Header from './modules/header'
import Button from './modules/button'

class App {
  constructor() {
    this.$el = $(config.app)
    this.$nav = $('.js-nav')

    this.header = new Header($('.js-header'))
    this.io = new IntersectionObserver(this.onIntersection, {
      threshold: 0.0,
    })

    this.buttons = []
    this.targets = []

    $(config.body).removeClass('is-loading')
  }

  onIntersection = (entries, observer) => {
    entries.forEach(entry => {
      const $target = $(entry.target)
      if (!entry.isIntersecting || $target.hasClass('shown')) return
      $target.addClass('shown')
    })
  }

  onResize(width, height) {
    this.header.resize(width, height)
  }

  onNewPageReady(currentStatus, prevStatus, container, html) {
    this.buttons.forEach(btn => btn.destroy())
    this.buttons = $(container)
      .find('.js-button')
      .toArray()
      .map(el => new Button($(el)))

    this.targets.forEach(el => this.io.unobserve(el))
    this.targets = $('.io, .io-img').toArray()
    this.targets.forEach(el => this.io.observe(el))
  }
}

export default () => new App()
