import Component from '../framework/component'
import $ from 'jquery'
import mapRange from '../util/mapRange'

class Background extends Component {
  constructor(opt = {}) {
    super()

    this.$el = $(opt.el)
    this.template = opt.template

    this.radius = opt.radius || 200
    this.rafId = null
    this.destroyed = false

    this.state = {
      elementCount: 0,
      mouseX: 0,
      mouseY: 0,
    }
  }

  init() {
    this.onResize()
    this.rafId = window.requestAnimationFrame(this.loop)
    $(document).on('mousemove', this.onMove)
  }

  destroy() {
    $(document).off('mousemove', this.onMove)
    window.cancelAnimationFrame(this.rafId)
    this.destroyed = true
  }

  onMove = ev => {
    this.setState({
      mouseX: ev.pageX,
      mouseY: ev.pageY,
    })
  }

  loop = () => {
    if (this.destroyed) return

    const { mouseX, mouseY } = this.state
    this.$children.each((i, el) => {
      const $el = $(el)
      const offset = $el.offset()
      const dx = Math.abs(mouseX - offset.left)
      const dy = Math.abs(mouseY - offset.top)
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.radius) {
        const norm = distance / this.radius
        const opacity = 1 - mapRange(norm, 0, 1, 0, 0.6)
        $el.css({ opacity })
      } else {
        $el.css({ opacity: 0.4 })
      }
    })

    this.rafId = window.requestAnimationFrame(this.loop)
  }

  onResize() {
    // store background dimensions
    this.width = this.$el.innerWidth()
    this.height = this.$el.innerHeight()
    // append the template, and store dimensions
    this.$el.append(this.template)
    this.$testElement = this.$el.children().first()
    this.testElementWidth = this.$testElement.innerWidth()
    this.testElementHeight = this.$testElement.innerHeight()
    // get minimum number of elements needed to fill the page
    const elementCount = Math.round(
      this.width / this.testElementWidth * this.height / this.testElementHeight,
    )

    this.setState({ elementCount })
  }

  didUpdate(oldState) {
    if (oldState.elementCount !== this.state.elementCount) {
      this.render(this.state)
    }
  }

  render({ elementCount }) {
    this.$el.html(
      Array(elementCount)
        .fill(this.template)
        .join('\n'),
    )

    this.$children = this.$el.children()
  }
}

export default Background
