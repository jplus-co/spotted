import Barba from 'barba.js'
import Slideshow from '../modules/slideshow'

const home = Barba.BaseView.extend({
  namespace: 'home',

  onEnter() {
    this.slideshow = new Slideshow({
      container: '.js-slideshow',
      slides: '.js-slideshow-slide',
      controls: '.js-pagination-button',
    })
  },

  onEnterCompleted() {},

  onLeave() {},

  onLeaveCompleted() {},
})

export default home
