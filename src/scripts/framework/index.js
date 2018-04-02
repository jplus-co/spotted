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
    // Revive :focus styles if user presses the tab key
    $(document).on('keyup', function awaitTab({ target, keyCode }) {
      if (
        keyCode !== 9 ||
        $(target)
          .closest('form')
          .hasClass('wpcf7-form')
      ) {
        return
      }
      $(document).off('keydown', awaitTab)
      $(config.body).removeClass('no-tab')
    })
  }

  addEvents() {
    $(window).resize(this.onResize)
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

    // Propogate window resize event through app
    typeof this.app.onResize === 'function' &&
      this.app.onResize(config.windowWidth, config.windowHeight)

    // Propogate window resize event through Barba views
    views.map(
      view =>
        typeof view.onResize === 'function' &&
        view.onResize(config.windowWidth, config.windowHeight),
    )
  }

  onNewPageReady = currentStatus => {
    // get path of current view
    const path = currentStatus.url.split(window.location.origin)[1].substring(1)
    const $link = this.app.$nav.find(`[href="/${path}"]`)
    // remove all 'current-menu-item' classes
    this.app.$nav.find('.current-menu-item').removeClass('current-menu-item')
    // add 'current-menu-item' class
    $link.addClass('current-menu-item')
    // add 'current-menu-item' to any parent menu items
    $link.closest('.js-dropdown').addClass('current-menu-item')
    // add `is-${namespace}` class to body for current view
    this.updateBodyClass()
  }

  onInitStateChange() {
    $(config.html).css({ pointerEvents: 'none' })
  }

  onTransitionCompleted() {
    $(config.html).css({ pointerEvents: 'auto' })
  }

  updateBodyClass() {
    $(config.body).addClass(
      `is-${Barba.Pjax.History.currentStatus().namespace}`,
    )

    if (Barba.Pjax.History.prevStatus()) {
      $(config.body).removeClass(
        `is-${Barba.Pjax.History.prevStatus().namespace}`,
      )
    }
  }
}

export default app => () => new Framework(app)
