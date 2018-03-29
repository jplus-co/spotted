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
    this.items = this.$el.find('.js-dropdown-item').toArray()

    this.init()
  }

  init() {
    this.resize()
    this.$el.on('mouseenter', this.onEnter)
  }

  onEnter = () => {
    if (this.$el.hasClass('expanded')) return

    this.hide()
    this.show()

    $(document).on('mousemove', this.onMove)
  }

  onMove = ({ target, clientX, clientY }) => {
    if (
      clientY > this.top ||
      $(target)
        .closest('a')
        .hasClass('nav__item--link')
    ) {
      this.onLeave()
    }
  }

  onLeave() {
    $(document).off('mousemove', this.onMove)
    this.hide()
  }

  show() {
    this.$el.addClass('expanded')

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
    this.$header
      .find('.expanded')
      .each((i, el) => $(el).removeClass('expanded'))

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
