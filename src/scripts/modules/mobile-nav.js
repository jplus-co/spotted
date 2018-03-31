import $ from 'jquery'
import config from '../config'
import anime from 'animejs'

class MobileNav {
  constructor(opt = {}) {
    this.$toggle = opt.toggle
    this.$menu = opt.menu
    this.$accordianControls = this.$menu.find('.js-accordian-toggle')
    this.$accordianEls = this.$menu.find('.js-accordian-outer')
    this.$focusableEls = this.$menu.find('.js-inert')
    this.menuItems = this.$menu.find('.js-nav-menu-item').toArray()
    this.init()
  }

  init() {
    $(document).on('click', this.handleClick)
  }

  destroy() {
    $(document).off('click', this.handleClick)
  }

  handleClick = ({ target }) => {
    const $target = $(target)
    const navToggleClick = $target.closest('button').hasClass('js-nav-toggle')
    const menuClick = $target.parent().hasClass('js-nav-menu')
    const menuItemClick = $target.closest('a').hasClass('js-nav-menu-item')
    const accordianToggleClick = $target.hasClass('js-accordian-toggle')
    const blockMenuClose =
      menuClick || (!navToggleClick && accordianToggleClick && !menuItemClick)
    if (this.$toggle.hasClass('open')) {
      this.collapseAccordians()
      if (accordianToggleClick) {
        $target
          .attr('aria-expanded', 'true')
          .next()
          .attr('aria-hidden', 'false')
          .find('.js-accordian-link')
          .attr('tabindex', '0')
      }
      if (blockMenuClose) return
      this.closeMenu()
    } else if (navToggleClick) {
      this.openMenu()
    }
  }

  openMenu() {
    this.$toggle.toggleClass('open')
    this.$menu.toggleClass('open')
    this.$focusableEls.attr('tabindex', '0')
    $('[aria-controls="mobile-nav"]')
      .attr('aria-expanded', 'true')
      .attr('tabindex', '-1')

    anime.remove(this.menuItems)
    anime({
      targets: this.menuItems,
      opacity: [0, 1],
      translateX: [100, 0],
      scaleX: [1.1, 1],
      duration: 800,
      easing: 'easeOutQuint',
      delay: (el, i, l) => i * 25,
    })
  }

  closeMenu() {
    this.$toggle.removeClass('open')
    this.$menu.removeClass('open')
    this.$focusableEls.attr('tabindex', '-1')
    $('[aria-controls="mobile-nav"]')
      .attr('aria-expanded', 'false')
      .attr('tabindex', '0')

    anime.remove(this.menuItems)
    anime({
      targets: this.menuItems,
      opacity: 0,
      translateX: 100,
      scaleX: 1.1,
      duration: 700,
      easing: 'easeOutQuint',
      delay: (el, i, l) => i * 25,
    })
  }

  collapseAccordians() {
    this.$accordianControls
      .attr('aria-expanded', 'false')
      .next()
      .attr('aria-hidden', 'true')
      .find('.js-accordian-link')
      .attr('tabindex', '-1')
  }
}

export default MobileNav
