import Barba from 'barba.js'
import Background from '../modules/background'

const NotFound = Barba.BaseView.extend({
  namespace: 'not-found',

  onEnter() {
    this.background = new Background({
      el: '.js-background',
      template: '<span>404</span>',
      radius: 200,
    })

    this.background.init()
  },

  onEnterCompleted() {},

  onLeave() {
    this.background.destroy()
  },

  onLeaveCompleted() {},

  onResize() {
    this.background.onResize()
  },
})

export default NotFound
