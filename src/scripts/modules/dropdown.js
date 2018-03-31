import $ from 'jquery'
import anime from 'animejs'
import config from '../config'

class Dropdown {
  constructor(el) {
    this.$el = $(el)
    this.$toggle = this.$el.find('.js-dropdown-toggle')
    this.$list = this.$el.find('.js-dropdown-list')
    this.$header = this.$el.closest('.js-header')
    this.$outer = this.$el.find('.js-dropdown-outer')
    this.$links = this.$el.find('.js-dropdown-link')
    this.items = this.$el.find('.js-dropdown-item').toArray()
    this.ESC_KEYCODE = 27
    this.init()
  }

  init() {
    this.resize()
    this.$el.on('click mouseenter', this.handle)
  }

  destroy() {
    this.$el.off('click mouseenter', this.handle)
  }

  handle = ev => {
    if (this.$el.hasClass('expanded')) return

    this.hide()
    this.show()

    $(document).on(
      ev.type === 'mouseenter' ? 'mousemove' : 'click keyup',
      this.awaitHide,
    )
  }

  awaitHide = ev => {
    if (
      ev.keyCode === this.ESC_KEYCODE ||
      ev.clientY > this.top ||
      $(ev.target)
        .closest('a')
        .hasClass('nav__item')
    ) {
      $(document).off(ev.type, this.awaitHide)
      this.hide()
    }
  }

  show() {
    this.$el.addClass('expanded')
    this.$el.find('.js-dropdown-toggle').attr('aria-expanded', 'true')
    this.$links.attr('tabindex', '0')
    anime.remove(this.items)
    anime({
      targets: this.items,
      opacity: [0, 1],
      translateX: [-20, 0],
      easing: 'easeOutQuint',
      duration: 600,
      delay: (el, i, l) => i * 30,
    })
  }

  hide() {
    this.$header.find('.expanded').removeClass('expanded')
    this.$header.find('.js-dropdown-link').attr('tabindex', '-1')
    this.$header.find('.js-dropdown-toggle').attr('aria-expanded', 'false')
    anime.remove(this.items)
    anime({
      targets: this.items,
      opacity: 0,
      translateX: 10,
      easing: 'easeOutQuint',
      duration: 500,
    })
  }

  resize = () => {
    const left = this.$toggle.offset().left

    this.$list.css({
      transform: `translateX(${left}px)`,
    })

    this.top = this.$header.height() + this.$outer.height()
  }
}

export default Dropdown
