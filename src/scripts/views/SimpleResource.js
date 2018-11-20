import Barba from 'barba.js'
import $ from 'jquery'
import anime from 'animejs'

const SimpleResource = Barba.BaseView.extend({
  namespace: 'simple-resource',

  onEnter() {
    this.onJumpClick = this.onJumpClick.bind(this)
    this.onSent = this.onSent.bind(this)

    this.$jump = $('.js-jump')
    this.$jump.click(this.onJumpClick)
    document.addEventListener('wpcf7mailsent', this.onSent, false)

  },

  onJumpClick(ev) {
    let $targetEl = $(this.$jump.attr('href'))
    let $header = $('.js-header')
    ev.preventDefault()
    anime.remove('html, body')
    anime({
      targets: 'html, body',
      scrollTop: $targetEl.offset().top - $header.height(),
      duration: 500,
      easing: 'easeInOutCubic',
    })
  },

  onSent(ev) {
    let { fileUrl, downloadLinkLabel } = $('.js-simple-resource-form').data()

    if (fileUrl) {
      let $message = $(ev.target).find('.wpcf7-mail-sent-ok')
      window.requestAnimationFrame(() => {
        $message[0].innerHTML += `
        <br>
        <a
          class="simple-cta__download-link"
          href="${fileUrl}"
          target="_blank"
          rel="noopener"
        >
          ${downloadLinkLabel}
        </a>
      `
      })
    }
  },

  onLeave() {
    document.removeEventListener('wpcf7mailsent', this.onSent, false)
  },

  onResize() {},
})

export default SimpleResource
