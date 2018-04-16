import $ from 'jquery'
import anime from 'animejs'
import Glitch from './glitch'
import clipPathShapeSupport from '../util/clipPathShapeSupport'
import gridLayoutSupport from '../util/gridLayoutSupport'
import randomInt from '../util/randomInt'
import timeout from '../util/timeout'

class Slideshow {
  constructor(opt = {}) {
    this.$container = $(opt.container)
    this.$slides = this.$container.find(opt.slides)
    this.$controls = this.$container.find(opt.controls)

    this.totalSlices = 60
    this.slideDuration = 5000

    this.state = {
      // supported: false,
      supported: clipPathShapeSupport() && gridLayoutSupport(),
      currentIndex: 0,
      autoplay: true,
    }

    this.init()
  }

  init() {
    $(this.inactiveSlides()).css('opacity', '0')
    this.$slides.removeClass('hidden')
    this.state.supported && this.sliceImages()
    this.$controls.on('click', this.onControlClick)
    this.animateInAttributes(this.state.currentIndex)
    this.state.autoplay && this.play()
  }

  play = () => {
    if (!this.state.autoplay) return

    return this.progress(this.slideDuration)
      .then(this.nextSlide)
      .then(this.play)
  }

  progress = duration => {
    const $el = this.$controls.eq(this.state.currentIndex)
    this.outer = $el.find('.js-pagination-button-outer')[0]
    this.inner = $el.find('.js-pagination-button-inner')[0]

    return Promise.all([
      anime({
        targets: this.outer,
        translateX: ['-100%', '0%'],
        easing: 'linear',
        duration,
      }).finished,
      anime({
        targets: this.inner,
        translateX: ['100%', '0%'],
        easing: 'linear',
        duration,
      }).finished,
    ])
  }

  animateOutProgress() {
    anime.remove(this.outer)
    anime.remove(this.inner)
    return Promise.all([
      anime({
        targets: this.outer,
        translateX: '100%',
        easing: 'easeOutQuint',
        duration: 700,
      }).finished,
      anime({
        targets: this.inner,
        translateX: '-100%',
        easing: 'easeOutQuint',
        duration: 700,
      }).finished,
    ])
  }

  animateInProgress() {
    if (this.state.autoplay) return

    const $el = this.$controls.eq(this.state.currentIndex)
    const outer = $el.find('.js-pagination-button-outer')[0]
    const inner = $el.find('.js-pagination-button-inner')[0]

    return Promise.all([
      anime({
        targets: outer,
        translateX: ['-100%', '0%'],
        easing: 'easeOutQuint',
        duration: 700,
      }).finished,
      anime({
        targets: inner,
        translateX: ['100%', '0%'],
        easing: 'easeOutQuint',
        duration: 700,
      }).finished,
    ]).then(() => {
      this.outer = outer
      this.inner = inner
    })
  }

  nextSlide = () => {
    if (!this.state.autoplay) return

    this.setState({
      currentIndex: (this.state.currentIndex + 1) % this.$slides.length,
    })
  }

  inactiveSlides() {
    return this.$slides
      .toArray()
      .filter((el, i) => i !== this.state.currentIndex)
  }

  sliceImages() {
    this.$slides.each((i, el) => {
      const $slide = $(el)
      const height = $slide.height()

      let innerHTML = ''
      for (let i = 0; i < this.totalSlices; i++) {
        const top = `calc(-${height}px / ${this.totalSlices} * ${i})`
        const x1 = `calc(100% / ${this.totalSlices} * ${i} - 1px)`
        const x2 = `calc(100% / ${this.totalSlices} * ${i + 1} + 1px)`
        const y1 = 0
        const y2 = '100%'
        const clipPath = `polygon(${y1} ${x1}, ${y2} ${x1}, ${y2} ${x2}, ${y1} ${x2})`
        const src = $slide.find('img').attr('src')
        const bgImage = `url(${src})`
        innerHTML += this.sliceTemplate(i, bgImage, top, clipPath, height)
      }

      $slide.remove('img')
      $slide.prepend(innerHTML)
      $slide.addClass('enhanced')
    })

    this.setGlitch()
  }

  setGlitch() {
    this.gfxArr = []
    this.$slides.find('.slice').each((i, slice) => {
      const dim = slice.offsetHeight
      this.gfxArr.push(
        new Glitch(slice, {
          glitchStart: { min: 100, max: 2500 },
          glitchState: { min: 50, max: 100 },
          glitchTotalIterations: 5,
          glitchStateProperty: 'top',
          glitchStateValue: () => randomInt(-1 * dim * 0.5, dim * 0.5) + 'px',
          glitchStateValueReset: '0px',
        }),
      )
    })
  }

  toggleGlitch(action = 'start') {
    for (const gfx of this.gfxArr) {
      gfx[action === 'start' ? 'glitch' : 'stop']()
    }
  }

  sliceTemplate(i, bgImage, top, clipPath, height) {
    return `<div class="slice slice--${i % 2 ? 'even' : 'odd'}">
        <div class="slice__inner">
          <div class="slice__bg" style="background-image: ${bgImage}; top: ${top}; -webkit-clip-path: ${clipPath}; clip-path: ${clipPath}; height: ${height}px;"></div>
        </div>
      </div>`
  }

  onControlClick = ev => {
    const $target = $(ev.target).closest('button')
    const newIndex = $target.data('index')

    if (newIndex !== this.state.currentIndex) {
      this.setState({ currentIndex: newIndex, autoplay: false })
    }
  }

  setState(obj = {}) {
    const oldState = this.state
    this.state = Object.assign({}, this.state, obj)
    this.didUpdate(oldState)
  }

  didUpdate(oldState) {
    const { currentIndex } = this.state
    if (oldState.currentIndex !== currentIndex) {
      this.setSlide(currentIndex)
    }
  }

  setSlide(index) {
    this.$slides.each((i, el) => {
      const attrEls = $(el)
        .find('.js-attr-title, .js-attr-line')
        .toArray()
      anime.remove(attrEls)
      anime.remove(el)
    })
    return this[`${this.state.supported ? 'enhanced' : 'fallback'}Transition`](
      index,
    )
  }

  enhancedTransition(index) {
    this.toggleGlitch()
    Promise.all([
      this.animateOutProgress(),
      this.animateInProgress(),
      anime({
        targets: this.inactiveSlides(),
        opacity: 0,
        duration: 1000,
        delay: 500,
        easing: 'easeOutQuint',
      }).finished,
      anime({
        targets: this.$slides.eq(index)[0],
        opacity: [0, 1],
        duration: 1000,
        delay: 500,
        easing: 'easeOutQuint',
      }).finished,
      this.animateInAttributes(index),
    ]).then(() => this.toggleGlitch('stop'))
  }

  fallbackTransition(index) {
    return Promise.all([
      this.animateOutProgress(),
      this.animateInProgress(),
      anime({
        targets: this.inactiveSlides(),
        opacity: 0,
        scale: 0.95,
        duration: 700,
        easing: 'easeOutQuint',
      }).finished,
      anime({
        targets: this.$slides.eq(index)[0],
        opacity: [0, 1],
        scale: [1.05, 1],
        duration: 700,
        easing: 'easeOutQuint',
      }).finished,
    ])
  }

  animateInAttributes(index) {
    return Promise.all([
      anime({
        targets: this.$slides
          .eq(index)
          .find('.js-attr-line')
          .toArray(),
        scaleX: [0, 1],
        easing: 'easeInOutQuint',
        duration: 1000,
        delay: 750,
      }).finished,
      anime({
        targets: this.$slides
          .eq(index)
          .find('.js-attr-title')
          .toArray(),
        opacity: [0, 1],
        easing: 'easeInOutQuint',
        duration: 1000,
        delay: 1000,
      }).finished,
    ])
  }
}

export default Slideshow
