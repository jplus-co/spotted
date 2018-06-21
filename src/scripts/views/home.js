import Barba from 'barba.js'
import Slideshow from '../modules/slideshow'

const Home = Barba.BaseView.extend({
  namespace: 'home',

  onEnter() {
    this.slideshow = new Slideshow({
      container: '.js-slideshow',
      slides: '.js-slideshow-slide',
      controls: '.js-pagination-button',
    })

    this.slideshow.init()
  },

  onEnterCompleted() {},

  onLeave() {
    this.slideshow.destroy()
  },

  onLeaveCompleted() {},
})

export default Home
