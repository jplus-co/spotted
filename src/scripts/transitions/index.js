import Barba from 'barba.js'
import css from 'dom-css'
import config from '../config'
import fade from './fade'

const map = {
  default: fade,

  // Define transitions between views using namespaces
  // home: {
  //   single: fade,
  // },
  // single: {
  //   home: fade,
  // },
}

export default function transitionReducer() {
  return Barba.BaseTransition.extend({
    start() {
      // show spinner while new page is being fetched
      css(config.html, { cursor: 'wait' })
      this.newContainerLoading.then(() => {
        // remove spinner as soon as new content is ready
        css(config.html, { cursor: 'default' })
        const from = Barba.Pjax.History.prevStatus().namespace
        const to = Barba.Pjax.History.currentStatus().namespace
        return ((map[from] && map[from][to]) || map.default)(
          this.oldContainer,
          this.newContainer,
          this.done.bind(this),
        )
      })
    },
  })
}
