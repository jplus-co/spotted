import Barba from 'barba.js'
import $ from 'jquery'
import config from '../config'
import views from '../views'
import transitionReducer from '../transitions'
import sniffer from 'sniffer'
import FastClick from 'fastclick'

class Framework {
  constructor(app) {
    this.app = app

    this.detect()
    this.addEvents()
    this.initBarba()
  }

  detect() {
    config.sniffer = sniffer.getInfos()
    sniffer.addClasses(config.body)
    config.sniffer.isDevice && FastClick.attach(config.body)
  }

  addEvents() {
    $(window).resize(this.onResize)
    Barba.Dispatcher.on('linkClicked', this.onLinkClicked)
    Barba.Dispatcher.on('initStateChange', this.onInitStateChange)
    Barba.Dispatcher.on('newPageReady', this.onNewPageReady)
    Barba.Dispatcher.on('transitionCompleted', this.onTransitionCompleted)
  }

  initBarba() {
    views.map(view => view.init())
    Barba.Prefetch.init()
    Barba.Pjax.getTransition = transitionReducer
    Barba.Pjax.start()
  }

  onResize = () => {
    // Update global config object
    config.windowWidth = window.innerWidth
    config.windowHeight = window.innerHeight

    // Propogate window resize event through app and Barba views
    typeof this.app.onResize === 'function' &&
      this.app.onResize(config.windowWidth, config.windowHeight)

    views.map(
      view =>
        typeof view.onResize === 'function' &&
        view.onResize(config.windowWidth, config.windowHeight),
    )
  }

  onLinkClicked = (link, ev) => {
    const $link = $(link)
    this.app.$nav.find('.current').removeClass('current')
    if ($link.closest('.js-nav')) {
      $link.addClass('current')
    }
  }

  onNewPageReady = () => {
    config.body.classList.add(
      `is-${Barba.Pjax.History.currentStatus().namespace}`,
    )

    if (Barba.Pjax.History.prevStatus()) {
      config.body.classList.remove(
        `is-${Barba.Pjax.History.prevStatus().namespace}`,
      )
    }
  }

  onInitStateChange() {
    $(config.html).css({ pointerEvents: 'none' })
  }

  onTransitionCompleted() {
    $(config.html).css({ pointerEvents: 'auto' })
  }
}

export default app => () => new Framework(app)
