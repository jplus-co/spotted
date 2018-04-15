import $ from 'jquery'
import anime from 'animejs'
import clipPathShapeSupport from '../util/clipPathShapeSupport'
import gridLayoutSupport from '../util/gridLayoutSupport'
import randomInt from '../util/randomInt'
import Glitch from './glitch'

class Slideshow {
  constructor(opt = {}) {
    this.$container = $(opt.container)
    this.$slides = this.$container.find(opt.slides)
    this.$controls = this.$container.find(opt.controls)

    this.totalSlices = 60
    this.orientation = 'horizontal'

    this.state = {
      // supported: false,
      supported: clipPathShapeSupport() && gridLayoutSupport(),
      currentIndex: 0,
      autoplay: true,
    }

    this.init()
  }

  init() {
    this.state.supported && this.sliceImages()
    this.$controls.on('click', this.onControlClick)

    $(this.inactiveSlides()).css('opacity', '0')
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

      $slide.html(innerHTML)
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
    this.setState({ currentIndex: $target.data('index') - 1 })
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
    return this[`${this.state.supported ? 'enhanced' : 'fallback'}Transition`](
      index,
    )
  }

  enhancedTransition(index) {
    this.$slides.each((i, el) => anime.remove(el))
    this.toggleGlitch()
    Promise.all([
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
    ]).then(() => this.toggleGlitch('stop'))
  }

  fallbackTransition(index) {
    this.$slides.each((i, el) => anime.remove(el))
    anime({
      targets: this.inactiveSlides(),
      opacity: 0,
      duration: 500,
      easing: 'easeOutQuint',
    })
    anime({
      targets: this.$slides.eq(index)[0],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutQuint',
    })
  }
}

export default Slideshow
